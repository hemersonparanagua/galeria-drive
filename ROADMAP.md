# Roadmap — Galeria Drive

## Objetivo

Criar uma ferramenta própria para Hemerson entregar galerias elegantes e, depois, permitir que clientes selecionem fotos. Google Drive armazena as imagens. O Vercel serve a aplicação. Supabase fica fora da arquitetura desejada.

## Já feito

- Projeto `galeria-drive` criado como repositório público no GitHub.
- Primeira publicação de produção criada no projeto Vercel `galeria-drive` (URL operacional fica fora do repositório público).
- Página de galeria clara, responsiva, com capa, mosaico, lightbox e navegação.
- CMS inicial em `/admin.html`; cadastro de título, texto, IDs de fotos e link da pasta; geração de link compartilhável.
- 11 fotos da pasta de produção foram adicionadas à publicação direta do Vercel via LH3; seus IDs e link da pasta não estão neste repositório público.

## Limites atuais

1. ~~O catálogo do CMS só existe no `localStorage` do navegador que o criou.~~ Resolvido: catálogo agora persiste em um arquivo JSON privado no Drive, lido/escrito por Serverless Functions do Vercel (`api/galleries.js`).
2. O conteúdo de cada galeria é embutido em Base64 na URL; Base64 não é criptografia. (Ainda pendente — ver P3.)
3. Arquivar uma galeria no painel não desativa links já gerados, porque o link carrega os dados na própria URL (depende do item 2/P3).
4. ~~O CMS não consegue listar automaticamente uma pasta nova do Drive; IDs precisam ser colados.~~ Resolvido: botão "Importar fotos da pasta" chama `api/drive-folder.js`, que lista imagens de um `folderId` via Drive API.
5. `selection` muda o texto da galeria, mas favoritos/limite de escolhas não estão implementados.
6. O download abre a pasta do Drive; ainda não entrega um ZIP ou downloads seletivos próprios.
7. O projeto Vercel foi publicado diretamente e ainda não está conectado ao repositório GitHub.

## Próximos passos sugeridos

### P1 — Persistência e acesso provisório do CMS ✅ (implementado nesta etapa, falta configurar no Vercel)

- Decisão tomada: arquivo JSON privado no Google Drive como "banco" (mais simples que Sheets, mantém tudo no Drive como Hemerson queria), lido/escrito por uma conta de serviço via Serverless Functions do Vercel. Sem Supabase.
- CMS com barreira provisória por `ADMIN_TOKEN` no servidor; não há contas individuais. Cadastro, login e papéis ficam para uma etapa posterior. Para essa etapa, consultar os padrões já usados: Google Identity Services com validação no backend no Planner Studio; Supabase Auth com e-mail/senha e aprovação manual no dashboard CRIVO. Preferências: evitar dependência de domínio, Resend e confirmação de e-mail. Nesta galeria, não usar Supabase para catálogo/fotos.
- Galerias salvas: título, descrição, pasta Drive, capa, modo (entrega/seleção), status ativo/arquivado, IDs de fotos.
- Pendente de configuração real: criar a conta de serviço no Google Cloud, compartilhar um arquivo `.json` vazio do Drive com ela, e preencher as variáveis listadas em `.env.example` no painel do Vercel. Deploy automático do GitHub ainda não foi conectado — ver item 7 acima.

### P2 — Criação de galeria a partir do Drive ✅ (implementado nesta etapa)

- No CMS, colar link de pasta compartilhada e extrair folder ID (feito em `extractFolderId` no `admin.js`).
- Listar arquivos de imagem pela Drive API (`api/drive-folder.js`), ordenados pelo nome; a primeira imagem vira capa sugerida.
- A listagem consulta apenas o `folderId` informado — nunca varre o Drive inteiro.
- Ainda falta: mostrar miniaturas no momento da importação (hoje só preenche os IDs) e permitir escolher a capa clicando em vez de colar o ID manualmente.

### P3 — Login final, links e entrega

- Login de usuário fica para esta etapa posterior. Comparar Google OAuth/Identity Services (precedente do Planner Studio) com e-mail/senha e aprovação manual (precedente CRIVO), sem decidir agora nem reintroduzir dependência de domínio/Resend. Validar identidade e autorização sempre no servidor.

- Gerar slug curto e único em vez de carregar a galeria completa na URL.
- Ler a galeria do catálogo persistente ao abrir o link.
- Arquivar/desativar deve impedir novos acessos por esse link, conforme o modelo de compartilhamento escolhido.
- Permitir abrir/baixar uma foto ou pasta final no Drive; avaliar ZIP somente se o fluxo e limites do Drive justificarem.
- Manter `noindex`, deixando explícito que isso não é controle de acesso.

### P4 — Seleção de fotos

- Favoritar/desfavoritar fotos e salvar a seleção no servidor.
- Definir quantidade incluída, limite e data final, com indicação clara ao cliente.
- Mostrar seleção no painel do fotógrafo e exportar nomes/IDs para o Lightroom.
- Implementar status: aberta, cliente selecionando, enviada, concluída.

### P5 — Extras opcionais

- Notificações por e-mail após seleção/entrega.
- Venda de fotos extras e integração de pagamento somente depois de validar seleção e entrega.

## Critérios de conclusão da próxima etapa

- Hemerson consegue criar/editar/desativar galerias de outro navegador e vê o mesmo catálogo.
- A aplicação lista apenas a pasta indicada e nunca oferece `01_Originais` como pasta pública.
- O link do cliente funciona sem login, mas uma galeria desativada deixa de ser carregada.
- O catálogo público do GitHub não contém IDs reais do Drive, tokens ou dados de cliente.
- A publicação do Vercel pode ser atualizada por um processo seguro e reproduzível.
