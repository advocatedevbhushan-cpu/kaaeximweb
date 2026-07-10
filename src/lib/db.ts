import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'kaaexim.db');
const wasmPath = path.join(process.cwd(), 'public', 'sql-wasm.wasm');

let db: DatabaseWrapper;
let initialized = false;

class Statement {
  private sql: string;
  private sqlDb: SqlJsDatabase;
  private stmt: any = null;
  constructor(sql: string, sqlDb: SqlJsDatabase) { this.sql = sql; this.sqlDb = sqlDb; }
  private ensurePrep(params?: any[]) {
    if (this.stmt) { this.stmt.free(); }
    this.stmt = this.sqlDb.prepare(this.sql);
    if (params && params.length > 0) { this.stmt.bind(params); }
  }
  run(...params: any[]) {
    this.ensurePrep(params);
    while (this.stmt.step()) { }
    const changes = this.sqlDb.getRowsModified();
    const rId = this.sqlDb.exec("SELECT last_insert_rowid() as id");
    this.stmt.free(); this.stmt = null;
    return { changes, lastInsertRowid: rId[0]?.values[0]?.[0] as number ?? 0 };
  }
  get(...params: any[]) {
    this.ensurePrep(params);
    let row: any;
    if (this.stmt.step()) { row = this.stmt.getAsObject(); }
    this.stmt.free(); this.stmt = null;
    return row;
  }
  all(...params: any[]) {
    this.ensurePrep(params);
    const rows: any[] = [];
    while (this.stmt.step()) { rows.push(this.stmt.getAsObject()); }
    this.stmt.free(); this.stmt = null;
    return rows;
  }
}

class DatabaseWrapper {
  private sqlDb: SqlJsDatabase;
  private stmtCache: Map<string, Statement> = new Map();
  constructor(sqlDb: SqlJsDatabase) { this.sqlDb = sqlDb; }
  prepare(sql: string) {
    if (!this.stmtCache.has(sql)) { this.stmtCache.set(sql, new Statement(sql, this.sqlDb)); }
    return this.stmtCache.get(sql)!;
  }
  exec(sql: string) { this.sqlDb.exec(sql); }
  transaction(fn: () => void) {
    return () => {
      this.sqlDb.exec("BEGIN");
      try { fn(); this.sqlDb.exec("COMMIT"); } catch (e) { this.sqlDb.exec("ROLLBACK"); throw e; }
    };
  }
  close() { this.sqlDb.close(); }
  export() { return this.sqlDb.export(); }
}

export async function getDb(): Promise<DatabaseWrapper> {
  if (!db) {
    const SQL = await initSqlJs({ locateFile: () => wasmPath });
    let buffer: Buffer | undefined;
    if (fs.existsSync(dbPath)) { buffer = fs.readFileSync(dbPath); }
    const sqlDb = new SQL.Database(buffer);
    db = new DatabaseWrapper(sqlDb);
  }
  return db;
}

function persistDb(): void {
  if (!db) return;
  const data = db.export();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
  fs.writeFileSync(dbPath, Buffer.from(data));
}

export async function initDb(): Promise<void> {
  if (initialized) return;
  const _db = await getDb();

  try {
    const r = _db.prepare("SELECT COUNT(*) as c FROM users LIMIT 1").get();
    if (r && r.c !== undefined && Number(r.c) >= 0) { initialized = true; return; }
  } catch { }

  _db.exec(`
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

  await seedInitialData(_db);
  persistDb();
}

async function seedInitialData(_db: DatabaseWrapper): Promise<void> {
  const seedTransaction = _db.transaction(() => {
    const adminCount = _db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin') as { count: number };
    if (adminCount.count === 0) {
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync('admin123', 10);
      _db.prepare('INSERT OR IGNORE INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(
        'Admin', 'admin@kaaexim.com', '9999999999', hash, 'admin'
      );
    }
    const cityCount = _db.prepare('SELECT COUNT(*) as count FROM shipping_cities').get() as { count: number };
    if (cityCount.count === 0) {
      const insert = _db.prepare('INSERT OR IGNORE INTO shipping_cities (city_name, state, small_order_allowed, bulk_order_allowed, small_delivery_charge, bulk_delivery_charge, min_order_value, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      insert.run('Ayodhya', 'Uttar Pradesh', 1, 1, 40, 0, 0, 1);
      insert.run('Lucknow', 'Uttar Pradesh', 0, 1, 0, 300, 0, 1);
      insert.run('Barabanki', 'Uttar Pradesh', 0, 1, 0, 250, 0, 1);
    }
    const catCount = _db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
    if (catCount.count === 0) {
      const insert = _db.prepare('INSERT OR IGNORE INTO categories (name, slug, description, display_order, status) VALUES (?, ?, ?, ?, ?)');
      insert.run('Packaged Food Products', 'packaged-food', 'Quality packaged food products for retail and bulk buyers', 1, 1);
      insert.run('Grocery Items', 'grocery', 'Everyday grocery essentials', 2, 1);
      insert.run('Snacks', 'snacks', 'Delicious snacks and namkeen', 3, 1);
      insert.run('Beverages', 'beverages', 'Refreshing beverages and drinks', 4, 1);
      insert.run('Household Products', 'household', 'Essential household and cleaning products', 5, 1);
      insert.run('Institutional Supply', 'institutional-supply', 'Bulk supply products for institutions and offices', 6, 1);
    }
    const productCount = _db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    if (productCount.count === 0) {
      const insert = _db.prepare(`INSERT OR IGNORE INTO products (category_id, name, slug, sku, short_description, full_description, mrp, selling_price, bulk_price, unit_type, min_small_qty, max_small_qty, min_bulk_qty, stock_quantity, status, is_featured, is_best_seller)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      insert.run(1, 'Choco Flakes 500g', 'choco-flakes-500g', 'KAE-PF-001', 'Delicious chocolate flavored breakfast cereal', 'Premium quality chocolate flavored flakes made from the finest grains.', 180, 150, 130, 'Packet', 1, 2, 20, 500, 1, 1, 1);
      insert.run(1, 'Wheat Biscuits Pack (200g)', 'wheat-biscuits-200g', 'KAE-PF-002', 'Healthy wheat biscuits for everyone', 'Nutritious wheat biscuits baked to perfection. Rich in fiber and essential nutrients.', 60, 45, 38, 'Packet', 1, 2, 50, 1000, 1, 1, 0);
      insert.run(2, 'Basmati Rice (5kg)', 'basmati-rice-5kg', 'KAE-GR-001', 'Premium quality basmati rice', 'Aged premium basmati rice with long grains and rich aroma.', 550, 480, 440, 'Packet', 1, 2, 20, 300, 1, 1, 1);
      insert.run(2, 'Toor Dal (1kg)', 'toor-dal-1kg', 'KAE-GR-002', 'Clean and pure toor dal', 'High-quality toor dal, cleaned and packed hygienically.', 180, 150, 135, 'Packet', 1, 2, 30, 400, 1, 0, 0);
      insert.run(3, 'Spicy Namkeen (200g)', 'spicy-namkeen-200g', 'KAE-SN-001', 'Crispy spicy namkeen mix', 'A delicious mix of spicy namkeen made from premium ingredients.', 50, 40, 34, 'Packet', 1, 2, 50, 800, 1, 1, 1);
      insert.run(3, 'Kurkure Style Snacks (150g)', 'kurkure-snacks-150g', 'KAE-SN-002', 'Crunchy and tasty snacks', 'Crispy, crunchy snacks with a burst of flavor.', 30, 25, 20, 'Packet', 1, 2, 60, 1200, 1, 0, 0);
      insert.run(4, 'Green Tea (100 Bags)', 'green-tea-100-bags', 'KAE-BV-001', 'Refreshing green tea bags', 'Premium green tea bags sourced from finest tea gardens.', 250, 200, 175, 'Packet', 1, 2, 20, 300, 1, 1, 0);
      insert.run(4, 'Mango Juice (1L)', 'mango-juice-1l', 'KAE-BV-002', 'Rich and creamy mango juice', 'Made from real mango pulp, no artificial flavors.', 120, 95, 82, 'Bottle', 1, 2, 24, 500, 1, 0, 1);
      insert.run(5, 'Multipurpose Cleaner (1L)', 'multipurpose-cleaner-1l', 'KAE-HH-001', 'Effective multipurpose cleaner', 'Powerful cleaning solution for all surfaces.', 150, 120, 100, 'Bottle', 1, 2, 30, 400, 1, 0, 0);
      insert.run(5, 'Hand Wash (500ml)', 'hand-wash-500ml', 'KAE-HH-002', 'Gentle and effective hand wash', 'Antibacterial hand wash that keeps your hands clean and soft.', 120, 95, 80, 'Bottle', 1, 2, 40, 600, 1, 1, 1);
      insert.run(6, 'Office Tea Pack (200 Bags)', 'office-tea-pack-200', 'KAE-IS-001', 'Bulk tea bags for offices', 'Premium quality tea bags ideal for offices, institutions, and bulk buyers.', 450, 380, 340, 'Box', 1, 2, 20, 200, 1, 1, 0);
      insert.run(6, 'Disposable Cups (100 Pack)', 'disposable-cups-100', 'KAE-IS-002', 'Hygienic disposable cups', 'High-quality disposable paper cups for offices and events.', 180, 150, 130, 'Pack', 1, 2, 50, 1000, 1, 0, 1);
    }
  });
  try { seedTransaction(); } catch { }
  initialized = true;
}
