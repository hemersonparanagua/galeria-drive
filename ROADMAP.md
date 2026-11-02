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

1. O catálogo do CMS só existe no `localStorage` do navegador que o criou.
2. O conteúdo de cada galeria é embutido em Base64 na URL; Base64 não é criptografia.
3. Arquivar uma galeria no painel não desativa links já gerados.
4. O CMS não consegue listar automaticamente uma pasta nova do Drive; IDs precisam ser colados.
5. `selection` muda o texto da galeria, mas favoritos/limite de escolhas não estão implementados.
6. O download abre a pasta do Drive; ainda não entrega um ZIP ou downloads seletivos próprios.
7. O projeto Vercel foi publicado diretamente e ainda não está conectado ao repositório GitHub.

## Próximos passos sugeridos

### P1 — Persistência e acesso do fotógrafo

- Decidir uma fonte persistente de metadados sem Supabase: avaliar Google Sheets/arquivo JSON privado no Drive versus pequena API do Vercel com Google OAuth.
- Restringir o painel administrativo ao Hemerson; não usar uma senha fixa embutida em JavaScript.
- Salvar galerias, status, slug, pasta Drive, capa, modo e seleção de IDs.
- Não conectar o deploy automático do GitHub ao Vercel até separar a configuração real da pasta de produção do código público.

### P2 — Criação de galeria a partir do Drive

- No CMS, colar link de pasta compartilhada e extrair folder ID.
- Listar arquivos de imagem pela Drive API, ordenar pelo nome, mostrar miniaturas e permitir selecionar capa/fotos.
- Permitir criar uma galeria só para pastas escolhidas; não varrer o Drive inteiro.
- Manter originais privados quando houver pasta de seleção; compartilhar apenas a pasta de entrega/seleção necessária.

### P3 — Links e entrega

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
