// backend/controllers/adminController.js
const User = require('../models/User');
const Business = require('../models/Business');
const Sale = require('../models/Sale');
const TaxTransaction = require('../models/TaxTransaction');
const AuditLog = require('../models/AuditLog');
const { buildBusinessGeoFilter } = require('../utils/geoScope');
const { notifyBusinessOwner } = require('../services/notificationService');

const buildGeoQuery = buildBusinessGeoFilter;

const PENDING_STATUSES = ['pending', 'pending_approval'];

exports.getDashboardStats = async (req, res) => {
  try {
    const query = buildGeoQuery(req.user);
    const businessIds = await Business.find(query).distinct('_id');

    const [totalBusinesses, totalSales, totalTaxCollected, pendingBusinesses] = await Promise.all([
      Business.countDocuments(query),
      businessIds.length
        ? Sale.countDocuments({ businessId: { $in: businessIds } })
        : 0,
      businessIds.length
        ? TaxTransaction.aggregate([
            { $match: { businessId: { $in: businessIds }, status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
          ])
        : [{ total: 0 }],
      Business.countDocuments({ ...query, status: { $in: PENDING_STATUSES } }),
    ]);
    
    res.json({
      totalBusinesses,
      totalSales,
      totalTaxCollected: totalTaxCollected[0]?.total || 0,
      pendingBusinesses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveBusiness = async (req, res) => {
  try {
    if (req.user.role !== 'sector_admin') {
      return res.status(403).json({ message: 'Only sector admin can approve businesses' });
    }

    const business = await Business.findOne({
      _id: req.params.id,
      status: { $in: PENDING_STATUSES },
      'address.sector': req.user.sector,
      'address.district': req.user.district,
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found in your sector' });
    }

    business.status = 'active';
    business.approvedBy = req.user._id;
    business.approvedAt = new Date();
    await business.save();

    await notifyBusinessOwner(business.ownerId, 'business_approved', business._id);

    res.json({ message: 'Business approved and ACTIVE', business });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectBusiness = async (req, res) => {
  try {
    if (req.user.role !== 'sector_admin') {
      return res.status(403).json({ message: 'Only sector admin can reject businesses' });
    }

    const business = await Business.findOne({
      _id: req.params.id,
      status: { $in: PENDING_STATUSES },
      'address.sector': req.user.sector,
      'address.district': req.user.district,
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found in your sector' });
    }

    business.status = 'rejected';
    business.rejectedBy = req.user._id;
    business.rejectedAt = new Date();
    business.rejectionReason = req.body.reason || '';
    await business.save();

    await notifyBusinessOwner(business.ownerId, 'business_rejected', business._id, {
      message: req.body.reason,
    });

    res.json({ message: 'Business rejected', business });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPendingBusinesses = async (req, res) => {
  try {
    const query = buildGeoQuery(req.user, { status: { $in: PENDING_STATUSES } });
    const businesses = await Business.find(query)
      .populate('ownerId', 'fullName email phoneNumber')
      .sort({ createdAt: 1 });
    
    res.json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const query = buildGeoQuery(req.user);
    if (req.query.province) query['address.province'] = req.query.province;
    if (req.query.district) query['address.district'] = req.query.district;
    if (req.query.sector) query['address.sector'] = req.query.sector;
    if (req.query.status) query.status = req.query.status;

    const businesses = await Business.find(query)
      .populate('ownerId', 'fullName email phoneNumber')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      businesses.map(async (b) => {
        const pendingTax = await TaxTransaction.aggregate([
          { $match: { businessId: b._id, status: 'pending' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        return {
          ...b.toObject(),
          taxStatus: pendingTax[0]?.total > 0 ? 'pending' : 'compliant',
          pendingTaxAmount: pendingTax[0]?.total || 0,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaxRevenue = async (req, res) => {
  try {
    const revenue = await TaxTransaction.aggregate([
      {
        $match: { status: 'paid' }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json(revenue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getComplianceReports = async (req, res) => {
  try {
    const reports = await Business.aggregate([
      {
        $lookup: {
          from: 'taxtransactions',
          localField: '_id',
          foreignField: 'businessId',
          as: 'taxes'
        }
      },
      {
        $project: {
          name: 1,
          registrationNumber: 1,
          totalTaxDue: { $sum: '$taxes.amount' },
          totalTaxPaid: {
            $sum: {
              $cond: [{ $eq: ['$taxes.status', 'paid'] }, '$taxes.amount', 0]
            }
          },
          complianceRate: {
            $multiply: [
              {
                $divide: [
                  {
                    $sum: {
                      $cond: [{ $eq: ['$taxes.status', 'paid'] }, '$taxes.amount', 0]
                    }
                  },
                  { $sum: '$taxes.amount' }
                ]
              },
              100
            ]
          }
        }
      }
    ]);
    
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBusinessesByGeography = async (req, res) => {
  try {
    const geography = await Business.aggregate([
      {
        $group: {
          _id: {
            province: '$address.province',
            district: '$address.district',
            sector: '$address.sector'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.province': 1, '_id.district': 1, '_id.sector': 1 } }
    ]);
    
    res.json(geography);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaxCollectionReport = async (req, res) => {
  try {
    const end = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const start = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);

    const geoQuery = buildGeoQuery(req.user);
    const businessIds = await Business.find(geoQuery).distinct('_id');

    const match = {
      paidAt: { $gte: start, $lte: end },
      status: 'paid',
    };
    if (businessIds.length) {
      match.businessId = { $in: businessIds };
    } else if (req.user.role !== 'national_admin') {
      return res.json([]);
    }

    const report = await TaxTransaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
            paymentMethod: '$paymentMethod'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);
    
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.suspendBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    business.status = 'suspended';
    await business.save();
    
    // Log action
    const auditLog = new AuditLog({
      userId: req.user._id,
      action: 'SUSPEND_BUSINESS',
      targetType: 'Business',
      targetId: business._id,
      details: { reason: req.body.reason },
      ipAddress: req.ip
    });
    await auditLog.save();
    
    res.json({ message: 'Business suspended successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};