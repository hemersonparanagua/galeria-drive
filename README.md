# Galeria Drive

Galerias fotográficas de cliente com identidade visual editorial clara. As imagens podem ser exibidas a partir do Google Drive pelo formato `lh3.googleusercontent.com`; o repositório contém apenas o código e arquivos de exemplo sem IDs de cliente.

## Estado atual

- Aplicação publicada em um projeto de produção do Vercel (URL operacional compartilhada diretamente com o proprietário).
- Painel em `/admin.html` com uma barreira provisória por token (`ADMIN_TOKEN`), sem contas individuais; o modelo final de login fica para uma etapa posterior.
- Interface de galeria com capa, grade, lightbox e navegação.
- Painel cria links de galeria; o catálogo agora persiste em um arquivo JSON privado no Google Drive, via Serverless Functions do Vercel (`/api/galleries`) — não depende mais do `localStorage`.
- Importação automática de fotos: cole o link de uma pasta do Drive e clique em "Importar fotos da pasta" (`/api/drive-folder`) para listar os arquivos de imagem daquela pasta.
- A pasta de produção contém 11 imagens no Drive; IDs e URL dessa pasta foram deixados fora deste repositório público.
- Sem Supabase. Vercel hospeda a interface e as Serverless Functions; Google Drive continua sendo o armazenamento das imagens e agora também do catálogo de metadados.

## Configuração necessária (antes de funcionar em produção)

1. Crie uma conta de serviço no Google Cloud com a Drive API ativada.
2. Crie um arquivo `catalogo.json` vazio (`[]`) no Drive e compartilhe-o como editor com o e-mail da conta de serviço.
3. Compartilhe também, como leitor, cada pasta que o painel precisará listar.
4. No Vercel, configure as variáveis de `.env.example` (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_CATALOG_FILE_ID`, `ADMIN_TOKEN`). Nunca comite valores reais.

## Decisão sobre login

O cadastro e login de usuários ficam para uma etapa posterior. Até lá, o CMS usa apenas um token provisório no servidor para não deixar as operações de gravação abertas; isso não é o modelo final de acesso. Como referência para decidir mais adiante: o Planner Studio já usa login Google (Google Identity Services) e validação no backend; o dashboard CRIVO usa Supabase Auth com e-mail/senha e liberação manual de usuários. A preferência registrada foi evitar dependência de domínio, Resend e confirmação de e-mail. Para esta galeria, a escolha final precisa respeitar a decisão de manter as fotos no Drive e não usar Supabase como banco.

## Limites conhecidos

O link do cliente ainda embute os dados da galeria em Base64 na própria URL (não é um slug curto lido do catálogo), então arquivar uma galeria não revoga links já enviados. Novas pastas precisam ser importadas manualmente pelo painel (não há sincronização automática por enquanto). O tipo "seleção" ainda não salva favoritos. Consulte [ROADMAP.md](ROADMAP.md) e [CLAUDE_HANDOFF.md](CLAUDE_HANDOFF.md).

## Desenvolvimento local

O frontend (`index.html`, `admin.html`) pode ser servido como site estático, mas as rotas `/api/*` exigem o runtime do Vercel. Use `vercel dev` (CLI do Vercel) para rodar frontend + Serverless Functions juntos localmente, com as variáveis de `.env.example` preenchidas. Não há dependências npm — as functions usam só módulos nativos do Node. Os arquivos `data/*.json` são exemplos vazios para não publicar IDs de fotos.

## Privacidade e segurança

Não comite IDs de arquivos/pastas do Drive, tokens OAuth, chaves de serviço ou informações identificáveis dos clientes. `noindex` reduz indexação, mas não protege uma URL pública. A publicação atual de demonstração do Vercel usa a pasta que Hemerson autorizou; o repositório de código não contém esses IDs.
