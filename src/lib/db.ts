import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'kaaexim.db');

let db: Database.Database;
let initialized = false;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');
  }
  return db;
}

export function initDb(): void {
  if (initialized) return;
  const db = getDb();

  try {
    const r = db.prepare("SELECT COUNT(*) as c FROM users LIMIT 1").get() as { c: number } | undefined;
    if (r && r.c >= 0) { initialized = true; return; }
  } catch {
    // DB file may not exist yet - proceed with creation
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      mobile TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      gst_number TEXT,
      business_name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      address_line_1 TEXT NOT NULL,
      address_line_2 TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      landmark TEXT,
      is_default INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      image TEXT,
      description TEXT,
      status INTEGER NOT NULL DEFAULT 1,
      display_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sku TEXT NOT NULL UNIQUE,
      short_description TEXT,
      full_description TEXT,
      mrp REAL NOT NULL DEFAULT 0,
      selling_price REAL NOT NULL DEFAULT 0,
      bulk_price REAL,
      gst_rate REAL,
      hsn_code TEXT,
      unit_type TEXT NOT NULL DEFAULT 'Piece',
      min_small_qty INTEGER NOT NULL DEFAULT 1,
      max_small_qty INTEGER NOT NULL DEFAULT 2,
      min_bulk_qty INTEGER NOT NULL DEFAULT 10,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      status INTEGER NOT NULL DEFAULT 1,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_best_seller INTEGER NOT NULL DEFAULT 0,
      allow_middle_qty INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS shipping_cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_name TEXT NOT NULL UNIQUE,
      state TEXT NOT NULL,
      small_order_allowed INTEGER NOT NULL DEFAULT 0,
      bulk_order_allowed INTEGER NOT NULL DEFAULT 0,
      small_delivery_charge REAL NOT NULL DEFAULT 0,
      bulk_delivery_charge REAL NOT NULL DEFAULT 0,
      min_order_value REAL NOT NULL DEFAULT 0,
      status INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      customer_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_mobile TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      order_type TEXT NOT NULL,
      subtotal REAL NOT NULL DEFAULT 0,
      delivery_charge REAL NOT NULL DEFAULT 0,
      gst_amount REAL NOT NULL DEFAULT 0,
      total_amount REAL NOT NULL DEFAULT 0,
      payment_method TEXT NOT NULL DEFAULT 'cod',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      order_status TEXT NOT NULL DEFAULT 'pending',
      landmark TEXT,
      delivery_instructions TEXT,
      gst_number TEXT,
      business_name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      sku TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bulk_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      business_name TEXT,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      gst_number TEXT,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      delivery_city TEXT NOT NULL,
      expected_delivery_date TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      admin_notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      inquiry_type TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedInitialData(db);
}

function seedInitialData(db: Database.Database): void {
  const seedTransaction = db.transaction(() => {
    const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin') as { count: number };
    if (adminCount.count === 0) {
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync('admin123', 10);
      db.prepare('INSERT OR IGNORE INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(
        'Admin', 'admin@kaaexim.com', '9999999999', hash, 'admin'
      );
    }

    const cityCount = db.prepare('SELECT COUNT(*) as count FROM shipping_cities').get() as { count: number };
    if (cityCount.count === 0) {
      const insert = db.prepare('INSERT OR IGNORE INTO shipping_cities (city_name, state, small_order_allowed, bulk_order_allowed, small_delivery_charge, bulk_delivery_charge, min_order_value, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      insert.run('Ayodhya', 'Uttar Pradesh', 1, 1, 40, 0, 0, 1);
      insert.run('Lucknow', 'Uttar Pradesh', 0, 1, 0, 300, 0, 1);
      insert.run('Barabanki', 'Uttar Pradesh', 0, 1, 0, 250, 0, 1);
    }

    const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
    if (catCount.count === 0) {
      const insert = db.prepare('INSERT OR IGNORE INTO categories (name, slug, description, display_order, status) VALUES (?, ?, ?, ?, ?)');
      insert.run('Packaged Food Products', 'packaged-food', 'Quality packaged food products for retail and bulk buyers', 1, 1);
      insert.run('Grocery Items', 'grocery', 'Everyday grocery essentials', 2, 1);
      insert.run('Snacks', 'snacks', 'Delicious snacks and namkeen', 3, 1);
      insert.run('Beverages', 'beverages', 'Refreshing beverages and drinks', 4, 1);
      insert.run('Household Products', 'household', 'Essential household and cleaning products', 5, 1);
      insert.run('Institutional Supply', 'institutional-supply', 'Bulk supply products for institutions and offices', 6, 1);
    }

    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    if (productCount.count === 0) {
      const insert = db.prepare(`INSERT OR IGNORE INTO products (category_id, name, slug, sku, short_description, full_description, mrp, selling_price, bulk_price, unit_type, min_small_qty, max_small_qty, min_bulk_qty, stock_quantity, status, is_featured, is_best_seller)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      insert.run(1, 'Choco Flakes 500g', 'choco-flakes-500g', 'KAE-PF-001', 'Delicious chocolate flavored breakfast cereal', 'Premium quality chocolate flavored flakes made from the finest grains. Perfect for breakfast or as a healthy snack.', 180, 150, 130, 'Packet', 1, 2, 20, 500, 1, 1, 1);
      insert.run(1, 'Wheat Biscuits Pack (200g)', 'wheat-biscuits-200g', 'KAE-PF-002', 'Healthy wheat biscuits for everyone', 'Nutritious wheat biscuits baked to perfection. Rich in fiber and essential nutrients.', 60, 45, 38, 'Packet', 1, 2, 50, 1000, 1, 1, 0);
      insert.run(2, 'Basmati Rice (5kg)', 'basmati-rice-5kg', 'KAE-GR-001', 'Premium quality basmati rice', 'Aged premium basmati rice with long grains and rich aroma. Ideal for biryani and pulao.', 550, 480, 440, 'Packet', 1, 2, 20, 300, 1, 1, 1);
      insert.run(2, 'Toor Dal (1kg)', 'toor-dal-1kg', 'KAE-GR-002', 'Clean and pure toor dal', 'High-quality toor dal, cleaned and packed hygienically. Rich in protein and essential nutrients.', 180, 150, 135, 'Packet', 1, 2, 30, 400, 1, 0, 0);
      insert.run(3, 'Spicy Namkeen (200g)', 'spicy-namkeen-200g', 'KAE-SN-001', 'Crispy spicy namkeen mix', 'A delicious mix of spicy namkeen made from premium ingredients. Perfect tea-time snack.', 50, 40, 34, 'Packet', 1, 2, 50, 800, 1, 1, 1);
      insert.run(3, 'Kurkure Style Snacks (150g)', 'kurkure-snacks-150g', 'KAE-SN-002', 'Crunchy and tasty snacks', 'Crispy, crunchy snacks with a burst of flavor. Perfect for all ages.', 30, 25, 20, 'Packet', 1, 2, 60, 1200, 1, 0, 0);
      insert.run(4, 'Green Tea (100 Bags)', 'green-tea-100-bags', 'KAE-BV-001', 'Refreshing green tea bags', 'Premium green tea bags sourced from finest tea gardens. Rich in antioxidants.', 250, 200, 175, 'Packet', 1, 2, 20, 300, 1, 1, 0);
      insert.run(4, 'Mango Juice (1L)', 'mango-juice-1l', 'KAE-BV-002', 'Rich and creamy mango juice', 'Made from real mango pulp, no artificial flavors. Refreshing and delicious.', 120, 95, 82, 'Bottle', 1, 2, 24, 500, 1, 0, 1);
      insert.run(5, 'Multipurpose Cleaner (1L)', 'multipurpose-cleaner-1l', 'KAE-HH-001', 'Effective multipurpose cleaner', 'Powerful cleaning solution for all surfaces. Safe and effective.', 150, 120, 100, 'Bottle', 1, 2, 30, 400, 1, 0, 0);
      insert.run(5, 'Hand Wash (500ml)', 'hand-wash-500ml', 'KAE-HH-002', 'Gentle and effective hand wash', 'Antibacterial hand wash that keeps your hands clean and soft.', 120, 95, 80, 'Bottle', 1, 2, 40, 600, 1, 1, 1);
      insert.run(6, 'Office Tea Pack (200 Bags)', 'office-tea-pack-200', 'KAE-IS-001', 'Bulk tea bags for offices', 'Premium quality tea bags ideal for offices, institutions, and bulk buyers. Rich taste and aroma.', 450, 380, 340, 'Box', 1, 2, 20, 200, 1, 1, 0);
      insert.run(6, 'Disposable Cups (100 Pack)', 'disposable-cups-100', 'KAE-IS-002', 'Hygienic disposable cups', 'High-quality disposable paper cups for offices and events.', 180, 150, 130, 'Pack', 1, 2, 50, 1000, 1, 0, 1);
    }
  });
  try { seedTransaction(); } catch { /* ignore concurrent init errors */ }
  initialized = true;
}
