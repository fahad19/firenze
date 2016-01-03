import Functions from '../../Functions';

export default class MemoryFunctions extends Functions {
  upper() { return this.addFunction('toUpperCase'); }

  lower() { return this.addFunction('toLowerCase'); }

  trim() { return this.addFunction('trim'); }

  concat(...columns) {
    this.query._concat = columns;

    return this.addFunction('concat');
  }
}
