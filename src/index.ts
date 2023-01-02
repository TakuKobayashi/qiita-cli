import { accessTokenInitialize } from './accessTokenInitialize';
import emoji from 'node-emoji';
import { newArticle } from './newArticle';
import { pullArticle } from './pullArticle';
import packageJson from '../package.json';
import { postArticle } from './postArticle';
import { program } from 'commander';
import { defaultProjectName } from './commons/articles';
import {
  InitInputOptions,
  PullArticleInputOptions,
  PostArticleInputOptions,
  NewArticleInputOptions,
} from '@/types/command';

const mainUsage = `Command:
qiita init                    qiitaとの接続設定
qiita pull:article            既に投稿されている記事をローカルにpullする
qiita new:article             新しい記事を追加
qiita post:article            ローカルの記事を投稿
qiita --version, -v           qiita-cliのバージョンを表示
qiita --help, -h              ヘルプ
`;

/**
 * Set global CLI configurations
 */
program.storeOptionsAsProperties(false);

program.version(
  packageJson.version,
  '-v, --version',
  [
    emoji.get('hatched_chick') + 'qiita cli',
    'version:',
    packageJson.version,
  ].join(' ')
);

program.usage(mainUsage);

program.helpOption('-h, --help', 'ヘルプ');

program
  .command('init')
  .description('qiitaとの接続設定. 初回のみ実行')
  .option(
    '-m, --method <method>',
    `accessTokenの取得方法をoauthまたはinputのどちらかを指定してください`,
    'oauth'
  )
  .action(async (options: InitInputOptions) => {
    await accessTokenInitialize(options);
  });

program
  .command('pull:article')
  .description('既に投稿されている記事をローカルにpullする')
  .option(
    '-t, --token <accessToken>',
    'Qiitaで発行したaccessTokenを入力してください'
  )
  .option(
    '-p, --project <baseProjectPath>',
    `記事の取得・投稿を行うための作業ディレクトリの場所を指定してください`,
    defaultProjectName
  )
  .action(async (options: PullArticleInputOptions) => {
    await pullArticle(options);
  });

program
  .command('new:article')
  .description('新しい記事を追加')
  .option(
    '-p, --project <baseProjectPath>',
    `記事の取得・投稿を行うための作業ディレクトリの場所を指定してください`,
    defaultProjectName
  )
  .option('-s, --simplify', `入力事項が省略されて新しい記事が作成されます`)
  .action(async (options: NewArticleInputOptions) => {
    await newArticle(options);
  });

program
  .command('post:article')
  .description('ローカルで新規作成した記事を選択的に投稿')
  .option(
    '-t, --token <accessToken>',
    'Qiitaで発行したaccessTokenを入力してください'
  )
  .option(
    '-p, --project <baseProjectPath>',
    `記事の取得・投稿を行うための作業ディレクトリの場所を指定してください`,
    defaultProjectName
  )
  .option(
    '-f, --file <uploadFilePath>',
    `投稿したい記事のファイルを指定してください`
  )
  .option(
    '-o, --overwrite',
    `新規投稿の場合、 記事のファイル名を "投稿したid名.md" のファイル名に上書きする`
  )
  .option('--all', `プロジェクト以下に存在する全ての記事を投稿する`)
  .option('--tweet', `新規投稿時にtwitterにも一緒に投稿する`)
  .action(async (options: PostArticleInputOptions) => {
    await postArticle(options);
  });

program.parse(process.argv);
