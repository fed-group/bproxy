#!/usr/bin/env node
/* eslint-disable no-console */

import { Command } from 'commander';
import { dev } from '../dev';

const program = new Command();

program.description('CLI').usage('<command> [options]');

program
  .command('help')
  .alias('-h')
  .description('帮助命令')
  .action(function (name, other) {
    console.log(`
支持的命令:
version, -v,-V 输出当前框架的版本
help,-h 输出帮助程序

Example call:
  $ malita <command> --help`);
  });

program
  .command('dev')
  .description('框架开发命令')
  .action(function () {
    dev();
  });

program.parse(process.argv);
