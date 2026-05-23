import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    offline_mode: "You are offline. Changes will sync when online.",
    online_mode: "Back online. Syncing data...",
    paid: "Paid",
    pending_tax: "Pending Tax",
    overdue: "Overdue",
    yes: "Yes",
    no: "No",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    submit: "Submit",
    logout: "Logout"
  },
  bottom_nav: {
    dashboard: "Home",
    products: "Products",
    sales: "Sales",
    invoices: "Invoices",
    taxes: "Taxes"
  },
  auth: {
    login: "Login",
    register: "Register",
    email: "Email Address",
    password: "Password",
    confirm_password: "Confirm Password",
    full_name: "Full Name",
    phone_number: "Phone Number",
    forgot_password: "Forgot Password?",
    no_account: "Don't have an account?",
    has_account: "Already have an account?",
    business_name: "Business Name",
    tin: "Tax Identification Number (TIN)",
    registration_number: "Registration Number"
  },
  dashboard: {
    welcome: "Welcome back",
    today_summary: "Today's Summary",
    total_revenue: "Total Revenue",
    total_sales: "Total Sales",
    products: "Products",
    pending_tax: "Pending Tax",
    this_month: "This month",
    due_soon: "Due soon",
    tax_trends: "Tax Trends",
    recent_sales: "Recent Sales",
    quick_actions: "Quick Actions",
    view_all: "View All",
    no_sales: "No sales yet today"
  },
  sales: {
    title: "Sales",
    new_sale: "New Sale",
    search_products: "Search products...",
    cart: "Shopping Cart",
    subtotal: "Amount (excl. VAT)",
    vat: "VAT included (18%)",
    price_includes_vat: "VAT included in price",
    total: "Total to pay",
    payment_method: "Payment Method",
    complete_sale: "Complete Sale",
    sale_completed: "Sale completed successfully!",
    saved_offline: "Sale saved locally. Will sync when online.",
    error_processing: "Error processing sale",
    customer_info: "Customer Information",
    customer_name: "Customer Name",
    customer_phone: "Customer Phone",
    customer_email: "Customer Email (Optional)",
    quantity: "Quantity",
    remove: "Remove",
    add_to_cart: "Add to Cart"
  },
  products: {
    title: "Products",
    add_product: "Add Product",
    edit_product: "Edit Product",
    name: "Product Name",
    price: "Price (RWF, VAT included)",
    quantity: "Quantity in Stock",
    tax_rate: "Tax Rate (%)",
    category: "Category",
    description: "Description",
    stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
    sku: "SKU"
  },
  taxes: {
    title: "Tax Management",
    pending_taxes: "Pending Taxes",
    paid_taxes: "Paid Taxes",
    overdue_taxes: "Overdue Taxes",
    pay_now: "Pay Now",
    amount: "Amount (RWF)",
    due_date: "Due Date",
    status: "Status",
    payment_history: "Payment History",
    total_pending: "Total Pending",
    total_paid: "Total Paid",
    pay_with_momo: "Pay with Mobile Money",
    select_provider: "Select Provider",
    mtn_momo: "MTN MoMo",
    airtel_money: "Airtel Money",
    phone_number: "Phone Number",
    confirm_payment: "Confirm Payment",
    payment_successful: "Payment successful!",
    payment_failed: "Payment failed. Please try again."
  },
  invoices: {
    title: "Invoices",
    invoice_number: "Invoice Number",
    date: "Date",
    customer: "Customer",
    amount: "Amount",
    status: "Status",
    download: "Download PDF",
    send_email: "Send to Email",
    view_details: "View Details",
    generate_invoice: "Generate Invoice",
    no_invoices: "No invoices found"
  },
  payment: {
    cash: "Cash",
    mobile_money: "Mobile Money",
    card: "Card",
    select_provider: "Select Provider",
    mtn_momo: "MTN MoMo",
    airtel_money: "Airtel Money",
    enter_phone: "Enter Phone Number",
    confirm_payment: "Confirm Payment"
  },
  errors: {
    required: "This field is required",
    invalid_email: "Please enter a valid email address",
    invalid_phone: "Please enter a valid phone number",
    password_mismatch: "Passwords do not match",
    network_error: "Network error. Please check your connection.",
    server_error: "Server error. Please try again later."
  }
};

// Kinyarwanda translations
const rwTranslations = {
  common: {
    save: "Bika",
    cancel: "Hagarika",
    delete: "Siba",
    edit: "Hindura",
    loading: "Ibiragiye...",
    offline_mode: "Ntabwo uri kumurongo. Ibihindutse bizahuza iyo umurongo ugarutse.",
    online_mode: "Ugarutse kumurongo. Ibyo wahunze birahuza...",
    paid: "Byishuwe",
    pending_tax: "Umusoro uracyategereje",
    overdue: "Umusoro urangiye igihe",
    yes: "Yego",
    no: "Oya",
    confirm: "Emeza",
    back: "Subira inyuma",
    next: "Ikurikira",
    submit: "Ohereza",
    logout: "Sohora"
  },
  bottom_nav: {
    dashboard: "Ahabanza",
    products: "Ibicuruzwa",
    sales: "Ubucuruzi",
    invoices: "Fagitire",
    taxes: "Umusoro"
  },
  auth: {
    login: "Kwinjira",
    register: "Kwiyandikisha",
    email: "Imeri",
    password: "Ijambobanga",
    confirm_password: "Emeza ijambobanga",
    full_name: "Izina ryuzuye",
    phone_number: "Nimero ya terefone",
    forgot_password: "Wibagiwe ijambobanga?",
    no_account: "Nta konti ufite?",
    has_account: "Umaze kugira konti?",
    business_name: "Izina ry'ubucuruzi",
    tin: "Nomero y'umusoro (TIN)",
    registration_number: "Nomero y'iyandikisha"
  },
  dashboard: {
    welcome: "Murakaza neza",
    today_summary: "Incamake y'uyu munsi",
    total_revenue: "Amafaranga yose",
    total_sales: "Ubucuruzi bwose",
    products: "Ibicuruzwa",
    pending_tax: "Umusoro uracyategereje",
    this_month: "Ukwezi kuno",
    due_soon: "Ukira igihe gito",
    tax_trends: "Imikorere y'umusoro",
    recent_sales: "Ubucuruzi buherutse",
    quick_actions: "Ibikorwa byihuse",
    view_all: "Reba byose",
    no_sales: "Nta bucuruzi bwakozwe uyu munsi"
  },
  sales: {
    title: "Ubucuruzi",
    new_sale: "Ubucuruzi bushya",
    search_products: "Shakisha ibicuruzwa...",
    cart: "Igikapu",
    subtotal: "Igiteranyo cyambere",
    vat: "VAT (18%)",
    total: "Igiteranyo",
    payment_method: "Uburyo bwo kwishyura",
    complete_sale: "Rangiza ubucuruzi",
    sale_completed: "Ubucuruzi barangije neza!",
    saved_offline: "Ubucuruzi bwabikwe. Buzahuza iyo umurongo ugarutse.",
    error_processing: "Habaye ikibazo mugukora ubucuruzi",
    customer_info: "Amakuru y'umukiriya",
    customer_name: "Izina ry'umukiriya",
    customer_phone: "Terefone y'umukiriya",
    customer_email: "Imeri y'umukiriya (Bishatse)",
    quantity: "Igiteranyo",
    remove: "Kuraho",
    add_to_cart: "Ongera mu gikapu"
  },
  products: {
    title: "Ibicuruzwa",
    add_product: "Ongera Igicuruzwa",
    edit_product: "Hindura Igicuruzwa",
    name: "Izina",
    price: "Igiciro (RWF)",
    quantity: "Igiteranyo",
    tax_rate: "Umusoro (%)",
    category: "Uruhererekane",
    description: "Ibisobanuro",
    stock: "Ibigize",
    low_stock: "Birakeye",
    out_of_stock: "Ntabwo bihari",
    sku: "SKU"
  },
  taxes: {
    title: "Imicungire y'Umusoro",
    pending_taxes: "Umusoro uracyategereje",
    paid_taxes: "Umusoro wishyuwe",
    overdue_taxes: "Umusoro urangiye igihe",
    pay_now: "Kwishyura nonaha",
    amount: "Amafaranga (RWF)",
    due_date: "Itariki",
    status: "Ihame",
    total_pending: "Igiteranyo gitegereje",
    total_paid: "Igiteranyo cyishyuwe",
    pay_with_momo: "Kwishyura na Mobile Money",
    confirm_payment: "Emeza kwishyura"
  },
  invoices: {
    title: "Fagitire",
    invoice_number: "Nomero ya fagitire",
    date: "Itariki",
    customer: "Umukiriya",
    amount: "Amafaranga",
    status: "Ihame",
    download: "Kurura PDF",
    send_email: "Ohereza kuri imeri",
    no_invoices: "Nta fagitire ziboneka"
  },
  payment: {
    cash: "Amakipi",
    mobile_money: "Mobile Money",
    card: "Ikarita",
    mtn_momo: "MTN MoMo",
    airtel_money: "Airtel Money",
    enter_phone: "Injiza nimero ya terefone"
  }
};

// French translations
const frTranslations = {
  common: {
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    loading: "Chargement...",
    offline_mode: "Vous êtes hors ligne. Les modifications seront synchronisées en ligne.",
    online_mode: "De retour en ligne. Synchronisation des données...",
    paid: "Payé",
    pending_tax: "Taxe en attente",
    overdue: "En retard",
    yes: "Oui",
    no: "Non",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    submit: "Soumettre",
    logout: "Déconnexion"
  },
  bottom_nav: {
    dashboard: "Accueil",
    products: "Produits",
    sales: "Ventes",
    invoices: "Factures",
    taxes: "Taxes"
  },
  auth: {
    login: "Connexion",
    register: "Inscription",
    email: "Adresse email",
    password: "Mot de passe",
    confirm_password: "Confirmer le mot de passe",
    full_name: "Nom complet",
    phone_number: "Numéro de téléphone",
    forgot_password: "Mot de passe oublié?",
    no_account: "Vous n'avez pas de compte?",
    has_account: "Vous avez déjà un compte?",
    business_name: "Nom de l'entreprise",
    tin: "Numéro d'identification fiscale (NIF)",
    registration_number: "Numéro d'enregistrement"
  },
  dashboard: {
    welcome: "Bon retour",
    today_summary: "Résumé du jour",
    total_revenue: "Revenu total",
    total_sales: "Ventes totales",
    products: "Produits",
    pending_tax: "Taxe en attente",
    this_month: "Ce mois-ci",
    due_soon: "Bientôt dû",
    recent_sales: "Ventes récentes",
    no_sales: "Aucune vente aujourd'hui"
  },
  sales: {
    title: "Ventes",
    new_sale: "Nouvelle vente",
    search_products: "Rechercher des produits...",
    cart: "Panier",
    subtotal: "Sous-total",
    vat: "TVA (18%)",
    total: "Total",
    payment_method: "Mode de paiement",
    complete_sale: "Finaliser la vente",
    sale_completed: "Vente effectuée avec succès!",
    saved_offline: "Vente enregistrée localement. Sera synchronisée en ligne.",
    customer_name: "Nom du client",
    customer_phone: "Téléphone du client"
  },
  products: {
    title: "Produits",
    add_product: "Ajouter un produit",
    name: "Nom du produit",
    price: "Prix (RWF)",
    quantity: "Quantité",
    tax_rate: "Taux de taxe (%)",
    stock: "Stock",
    low_stock: "Stock faible"
  },
  taxes: {
    title: "Gestion des taxes",
    pending_taxes: "Taxes en attente",
    paid_taxes: "Taxes payées",
    pay_now: "Payer maintenant",
    amount: "Montant",
    due_date: "Date d'échéance",
    confirm_payment: "Confirmer le paiement"
  },
  invoices: {
    title: "Factures",
    download: "Télécharger PDF",
    send_email: "Envoyer par email"
  },
  payment: {
    cash: "Espèces",
    mobile_money: "Mobile Money",
    card: "Carte",
    mtn_momo: "MTN MoMo",
    airtel_money: "Airtel Money"
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    rw: { translation: rwTranslations },
    fr: { translation: frTranslations }
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;