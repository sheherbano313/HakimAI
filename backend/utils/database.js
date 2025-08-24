const fs = require('fs');
const path = require('path');

class JSONDatabase {
  constructor(filename) {
    this.filepath = path.join(__dirname, '../data', filename);
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(this.filepath)) {
      fs.writeFileSync(this.filepath, '[]', 'utf8');
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filepath}:`, error);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Error writing to ${this.filepath}:`, error);
      return false;
    }
  }

  findOne(query) {
    const data = this.read();
    return data.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  find(query = {}) {
    const data = this.read();
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  insert(item) {
    const data = this.read();
    const newItem = { ...item, id: this.generateId(), createdAt: new Date().toISOString() };
    data.push(newItem);
    this.write(data);
    return newItem;
  }

  update(id, updates) {
    const data = this.read();
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
      this.write(data);
      return data[index];
    }
    return null;
  }

  delete(id) {
    const data = this.read();
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      const deleted = data.splice(index, 1)[0];
      this.write(data);
      return deleted;
    }
    return null;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = JSONDatabase;
