# Handoff para Claude / próximos agentes

## Contexto

Hemerson está retomando a fotografia e quer uma galeria de cliente inspirada no Pixieset para entrega e, mais tarde, seleção de imagens como no Selpics. O portfólio atual é `hemersonparanagua.com` (Blogger) e usa estilo editorial claro e imagens do Drive via `lh3.googleusercontent.com`.

## Infra e preferências

- Repositório público: `hemersonparanagua/galeria-drive`.
- Vercel: projeto `galeria-drive`; deployment de produção ativo (URL operacional compartilhada diretamente com Hemerson).
- Google Drive mantém os originais, seleção e fotos finais. Não copiar imagens para Supabase/Vercel.
- Não usar Supabase nesta aplicação sem pedido explícito. Vercel é hospedagem da interface; backend/persistência ainda precisa ser desenhado.
- O usuário aceita galerias acessíveis a familiares por link. Ainda assim, não colocar IDs de cliente no repositório público.

## O que existe

`index.html` + `src/app.js` + `src/styles.css`: galeria adaptável, capa, fotos, modal lightbox.
`admin.html` + `src/admin.js` + `src/admin.css`: formulário simples, lista local, copiar link, arquivar/reativar.
`data/*.json`: exemplos vazios, sem IDs reais.

A versão atual do Vercel foi implantada diretamente e contém lista de 11 fotos da pasta `escolhidas`, enviada no deployment; os IDs não foram copiados para este repo. O CMS é somente localStorage. Links carregam dados codificados em Base64 e não podem ser revogados pelo painel.

## Regras para mudanças

1. Leia `README.md` e `ROADMAP.md` antes de editar.
2. Preserve a arquitetura sem Supabase e o armazenamento de imagens no Google Drive, salvo nova instrução expressa de Hemerson.
3. Nunca comite link/ID da pasta real, IDs de arquivos, token OAuth, credenciais de conta de serviço ou dados identificáveis de cliente. Use dados de exemplo vazios.
4. Não assuma que `noindex` protege a galeria; arquivos Google Drive configurados como “qualquer pessoa com o link” continuam acessíveis a quem obtiver o endereço.
5. Antes de conectar GitHub ao Vercel, defina como dados da pasta de produção ficam fora do repositório e como o deploy de produção preserva/configura essas galerias.
6. Primeiro implemente autenticação do fotógrafo, armazenamento persistente de metadados e listagem de uma pasta selecionada. Pagamentos são fase posterior.

## Primeira tarefa recomendada

Proponha a arquitetura mais simples e sem custo adicional relevante para autenticar Hemerson no CMS e persistir metadados no Google Drive/Google Sheets, mantendo a aplicação no Vercel. Compare os limites e a experiência de operação; depois implemente um fluxo ponta a ponta para criar uma galeria e carregar somente imagens de uma pasta que o fotógrafo indicar. Não varra o Drive inteiro e não exponha originais.
