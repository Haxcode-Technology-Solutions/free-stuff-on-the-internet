-- Haxcode FMHY Platform Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS haxcode_fmhy
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE haxcode_fmhy;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_verified TINYINT(1) DEFAULT 0,
  verification_token VARCHAR(128) DEFAULT NULL,
  verification_expires DATETIME DEFAULT NULL,
  reset_token VARCHAR(128) DEFAULT NULL,
  reset_expires DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_verification_token (verification_token),
  INDEX idx_reset_token (reset_token)
) ENGINE=InnoDB;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  icon VARCHAR(50) DEFAULT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  url VARCHAR(2048) DEFAULT NULL,
  category_id INT UNSIGNED DEFAULT NULL,
  category VARCHAR(100) DEFAULT NULL,
  subcategory VARCHAR(100) DEFAULT NULL,
  tags VARCHAR(500) DEFAULT NULL,
  is_free TINYINT(1) DEFAULT 1,
  popularity_score INT DEFAULT 0,
  view_count INT UNSIGNED DEFAULT 0,
  fmhy_source_id VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT INDEX ft_search (title, description, tags),
  INDEX idx_slug (slug),
  INDEX idx_category_id (category_id),
  INDEX idx_popularity (popularity_score DESC),
  INDEX idx_view_count (view_count DESC),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_fmhy_source (fmhy_source_id),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  resource_id INT UNSIGNED NOT NULL,
  parent_id INT UNSIGNED DEFAULT NULL,
  comment TEXT NOT NULL,
  is_approved TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_resource (resource_id),
  INDEX idx_user (user_id),
  INDEX idx_parent (parent_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  resource_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_bookmark (user_id, resource_id),
  INDEX idx_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  frequency ENUM('daily', 'weekly', 'trending') DEFAULT 'weekly',
  is_verified TINYINT(1) DEFAULT 0,
  token VARCHAR(128) NOT NULL,
  unsubscribe_token VARCHAR(128) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_token (token),
  INDEX idx_unsub_token (unsubscribe_token)
) ENGINE=InnoDB;

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  request_count INT UNSIGNED DEFAULT 1,
  window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ip_endpoint (ip_address, endpoint),
  INDEX idx_window (window_start)
) ENGINE=InnoDB;

-- FMHY sync log
CREATE TABLE IF NOT EXISTS fmhy_sync_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sync_type VARCHAR(50) NOT NULL,
  records_synced INT UNSIGNED DEFAULT 0,
  status ENUM('started', 'completed', 'failed') DEFAULT 'started',
  error_message TEXT DEFAULT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP DEFAULT NULL
) ENGINE=InnoDB;

-- Insert default categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Tools', 'tools', 'tools', 1),
  ('Software', 'software', 'software', 2),
  ('Education', 'education', 'education', 3),
  ('Media', 'media', 'media', 4),
  ('Privacy', 'privacy', 'privacy', 5),
  ('Gaming', 'gaming', 'gaming', 6),
  ('Development', 'development', 'development', 7),
  ('Android', 'android', 'android', 8),
  ('Linux', 'linux', 'linux', 9),
  ('Storage', 'storage', 'storage', 10),
  ('AI', 'ai', 'ai', 11),
  ('Miscellaneous', 'misc', 'misc', 12)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert default admin user (password: admin123 - CHANGE IN PRODUCTION)
INSERT INTO users (name, email, password_hash, role, is_verified) VALUES
  ('Admin', 'admin@haxcode.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample resources
INSERT INTO resources (title, slug, description, category_id, category, tags, is_free, popularity_score, url) VALUES
  ('VS Code', 'vs-code', 'Free, open-source code editor by Microsoft with extensive extension support.', 7, 'Development', 'editor,code,microsoft,open-source', 1, 950, 'https://code.visualstudio.com'),
  ('Brave Browser', 'brave-browser', 'Privacy-focused web browser with built-in ad blocker and Tor integration.', 5, 'Privacy', 'browser,privacy,ad-blocker,chromium', 1, 890, 'https://brave.com'),
  ('LibreOffice', 'libreoffice', 'Free and open-source office productivity suite compatible with Microsoft Office formats.', 2, 'Software', 'office,documents,spreadsheet,open-source', 1, 820, 'https://www.libreoffice.org'),
  ('Khan Academy', 'khan-academy', 'Free online education platform with courses in math, science, and more.', 3, 'Education', 'learning,courses,math,science,free', 1, 910, 'https://www.khanacademy.org'),
  ('VLC Media Player', 'vlc-media-player', 'Free, open-source multimedia player that supports virtually all video and audio formats.', 4, 'Media', 'video,audio,player,open-source', 1, 870, 'https://www.videolan.org'),
  ('GIMP', 'gimp', 'Free and open-source image editor, a powerful alternative to Adobe Photoshop.', 1, 'Tools', 'image-editor,photoshop,open-source,design', 1, 780, 'https://www.gimp.org'),
  ('Bitwarden', 'bitwarden', 'Open-source password manager for individuals and teams.', 5, 'Privacy', 'password-manager,security,open-source', 1, 850, 'https://bitwarden.com'),
  ('Blender', 'blender', 'Free and open-source 3D creation suite for modeling, animation, and rendering.', 1, 'Tools', '3d,modeling,animation,open-source', 1, 920, 'https://www.blender.org'),
  ('OBS Studio', 'obs-studio', 'Free, open-source software for video recording and live streaming.', 4, 'Media', 'streaming,recording,video,open-source', 1, 900, 'https://obsproject.com'),
  ('Coursera', 'coursera', 'Online learning platform offering courses from top universities and companies.', 3, 'Education', 'courses,university,certificates,learning', 0, 880, 'https://www.coursera.org'),
  ('Signal', 'signal-messenger', 'Privacy-focused encrypted messaging app.', 5, 'Privacy', 'messaging,encrypted,privacy,open-source', 1, 860, 'https://signal.org'),
  ('Audacity', 'audacity', 'Free, open-source audio editing software for recording and editing sounds.', 4, 'Media', 'audio,editing,recording,open-source', 1, 810, 'https://www.audacityteam.org')
ON DUPLICATE KEY UPDATE title = VALUES(title);
