# Solana Wallet App

## Описание

Приложение крипто-кошелька и перевода средств в сети Solana.

## Установка и запуск

1. Клонируйте репозиторий:

```bash
git clone https://github.com/your-repo/solana-wallet.git
cd solana-wallet
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите локальный сервер:

```bash
npm run dev
```

## Сборка приложения

```bash
npm run build
```

## Настройка Solana CLI и пополнение кошелька

1. Скачайте Solana CLI для Windows:

Перейдите на страницу релизов Solana (https://github.com/solana-labs/solana/releases) и найдите последнюю версию. Скачайте установочный файл solana-install-init-x86_64-pc-windows-msvc.exe и перенесите его в папку, где открыт PowerShell.

2. Откройте PowerShell от имени администратора:

Win+X и выбрать PowerShell.

3. Перейдите в каталог с загруженным файлом и выполните команду для установки:

.\solana-install-init-x86_64-pc-windows-msvc.exe --data-dir C:\Users\Matvey\solana-wallet\data v1.9.4

4. Перезапустите текущую оболочку, чтобы изменения PATH вступили в силу:

Закройте текущую оболочку PowerShell и откройте новую.

## Создание и настройка кошелька

1. Настройка Solana CLI на Devnet:

```bash
solana config set --url https://api.devnet.solana.com
```

2. Создайте новый кошелек и сохраните ключи:

```bash
solana-keygen new -o C:\Users\Matvey\.config\solana\id.json
```

## Пополнение кошелька в PowerShell

1. Пополните кошелек SOL в Devnet:

```bash
solana airdrop 2
```

2. Проверка баланса:

```bash
solana balance
```

## Пополнение нашего созданного кошелька

```bash
solana <RECIPIENT_ADDRESS> <AMOUNT> 1 --from C:\Users\Matvey\.config\solana\id.json --allow-unfunded-recipient
```

Обновляем наш кошелёк и видим пополнение. Затем можно отправить средства обратно.
