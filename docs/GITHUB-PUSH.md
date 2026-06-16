# Enviar código para o GitHub (conta matheushsiilva)

O Supabase exige a branch `main` no repositório. Siga estes passos:

## 1. Remover login errado do Windows

1. Abra **Gerenciador de Credenciais** → Credenciais do Windows
2. Remova entradas `git:https://github.com`

## 2. Login na conta correta

No PowerShell:

```powershell
cd "c:\Users\PC\Documents\Sabor Gold"
gh auth login
```

- GitHub.com → HTTPS → Login no navegador com **matheushsiilva**

## 3. Enviar o projeto

```powershell
git add -A
git commit -m "Site Sabor Gold: WhatsApp direto, logo premium, admin corrigido" 
git push -u origin main
```

Se o repositório remoto já tiver commits, use:

```powershell
git pull origin main --rebase
git push origin main
```

## 4. Supabase

Depois do push, volte em **Integrations → GitHub** e conecte de novo. A branch `main` aparecerá.
