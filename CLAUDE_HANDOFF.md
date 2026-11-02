# Handoff para Claude / próximos agentes

## Contexto

Hemerson está retomando a fotografia e quer uma galeria de cliente inspirada no Pixieset para entrega e, mais tarde, seleção de imagens como no Selpics. O portfólio atual é `hemersonparanagua.com` (Blogger) e usa estilo editorial claro e imagens do Drive via `lh3.googleusercontent.com`.

## Infra e preferências

- Repositório público: `hemersonparanagua/galeria-drive`.
- Vercel: projeto `galeria-drive`; deployment de produção ativo (URL operacional compartilhada diretamente com Hemerson).
- Google Drive mantém os originais, seleção e fotos finais. Não copiar imagens para Supabase/Vercel.
- Não usar Supabase nesta aplicação para fotos ou catálogo. Vercel hospeda a interface e as Serverless Functions; o catálogo foi planejado para um JSON privado no Drive, mas essa persistência ainda depende das credenciais de produção.
- O usuário aceita galerias acessíveis a familiares por link. Ainda assim, não colocar IDs de cliente no repositório público.

## Decisão sobre login

Não implementar agora cadastro de usuários, recuperação de senha ou autorização por papéis. O token `ADMIN_TOKEN` nesta versão é uma barreira provisória do CMS para que endpoints de gravação não fiquem abertos; não tratar como solução final nem como login de cliente. Reavaliar no fim usando os precedentes dos projetos Crivo: Google Identity Services + validação server-side no Planner Studio, ou Supabase Auth com aprovação manual no dashboard. O usuário prefere não depender de domínio, Resend nem confirmação de e-mail, e não quer Supabase para armazenar fotos ou o catálogo desta galeria.

## O que existe

`index.html` + `src/app.js` + `src/styles.css`: galeria adaptável, capa, fotos, modal lightbox.
`admin.html` + `src/admin.js` + `src/admin.css`: CMS com token provisório, consulta e gravação do catálogo via `/api/galleries`, importação de imagens de uma pasta específica do Drive e links compartilháveis.
`api/`: funções de autenticação provisória e integração Google Drive.
`data/*.json`: exemplos vazios, sem IDs reais.

A produção ativa ainda é a publicação direta anterior, com 11 imagens da pasta escolhidas; os IDs não estão neste repo. A nova implementação do CMS ainda não está configurada no Vercel. Os links atuais carregam dados em Base64 e não podem ser revogados pelo painel.

## Regras para mudanças

1. Leia `README.md` e `ROADMAP.md` antes de editar.
2. Login completo fica para etapa posterior; preserve só a barreira provisória do CMS e não crie cadastro/reset/roles agora.
3. Preserve a arquitetura sem Supabase e o armazenamento de imagens no Google Drive, salvo nova instrução expressa de Hemerson.
4. Nunca comite link/ID da pasta real, IDs de arquivos, token OAuth, credenciais de conta de serviço ou dados identificáveis de cliente. Use dados de exemplo vazios.
5. Não assuma que `noindex` protege a galeria; arquivos Google Drive configurados como “qualquer pessoa com o link” continuam acessíveis a quem obtiver o endereço.
6. Antes de conectar GitHub ao Vercel, defina como dados da pasta de produção ficam fora do repositório e como o deploy de produção preserva/configura essas galerias.
7. Desenvolva primeiro persistência de metadados e listagem de uma pasta selecionada; autenticação completa e pagamentos são fases posteriores.

## Primeira tarefa recomendada

~~Proponha a arquitetura...~~ Feito em 2026-11-02: arquivo JSON privado no Drive como catálogo (mais simples que Sheets, mantém tudo no Drive), lido/escrito por `api/galleries.js` via conta de serviço (`api/_googleAuth.js`, `api/_drive.js`), protegido por `ADMIN_TOKEN` (`api/_auth.js`). Importação de pasta implementada em `api/drive-folder.js`, consultando apenas o `folderId` informado.

Isso ainda **não está ativo em produção**: faltam (1) criar a conta de serviço real no Google Cloud, (2) criar e compartilhar o arquivo-catálogo no Drive, (3) preencher as variáveis de ambiente no Vercel (ver `.env.example`), e (4) decidir se/quando conectar o deploy automático do GitHub ao projeto Vercel — a regra 5 abaixo ainda se aplica a essa decisão.

## Próxima tarefa recomendada

Antes de ativar esta versão em produção: configurar a conta de serviço e o catálogo JSON no Drive, definir o destino de prévia no Vercel e validar a migração sem perder a galeria ativa. Em seguida, trocar o link Base64 por um slug consultado no catálogo para permitir revogação; login completo continua adiado.
