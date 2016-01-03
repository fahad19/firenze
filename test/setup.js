import firenze from '../';
import config from './config';

const {Mysql, Memory} = config;

let firenzeConfig = Mysql;

if (process.env.FIRENZE_CONFIG === 'Memory') {
  firenzeConfig = Memory;
}

global.firenze = firenze;
global.firenzeConfig = firenzeConfig;
