import { transform, Config } from '@svgr/core';
import { basename, dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import { upperFirst } from 'lodash-es';

interface Options {
  filename: string;
  svg: string;
  memo: boolean;
  jsxRuntime: 'classic' |	'automatic' |	'classic-preact';
  typescript?: boolean;
  enableSvgo?: boolean;
  prettierConfig?: Pick<Config, 'prettierConfig'>
}

/**
 * 转换 svg
 */
export const transformSvg = async ({
  filename,
  svg,
  memo,
  jsxRuntime,
  typescript = false,
  enableSvgo = false,
  prettierConfig
}: Options) => {
  const config: Config = {
    plugins: ['@svgr/plugin-jsx', '@svgr/plugin-prettier'],
    icon: 24,
    memo,
    jsxRuntime,
    typescript,
    prettierConfig
  };

  if(enableSvgo) {
    config.plugins?.splice(0, 0, '@svgr/plugin-svgo');
    config.svgoConfig = {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // disable remove viewBox, or it can't be controlled by width and height in react component
              removeViewBox: false,
            },
          },
        },
      ],
    };
  }

  return await transform(
    svg,
    config,
    { componentName: upperFirst(filename) },
  );
};

/**
 * 读取svg文件
 */
export const readFile = (filepath: string) => {
  const dir = dirname(filepath);
  const name = basename(filepath, '.svg');
  const svg = readFileSync(resolve(filepath), 'utf-8');

  return {
    name,
    svg,
    dir
  };
};