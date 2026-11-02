# Galeria Drive

Galerias fotográficas de cliente com identidade visual editorial clara. As imagens podem ser exibidas a partir do Google Drive pelo formato `lh3.googleusercontent.com`; o repositório contém apenas o código e arquivos de exemplo sem IDs de cliente.

## Estado atual

- Aplicação publicada em um projeto de produção do Vercel (URL operacional compartilhada diretamente com o proprietário).
- Painel acessível na rota `/admin.html`.
- Interface de galeria com capa, grade, lightbox e navegação.
- Painel cria links de galeria e mantém o catálogo no `localStorage` do navegador.
- A pasta de produção contém 11 imagens no Drive; IDs e URL dessa pasta foram deixados fora deste repositório público.
- Sem Supabase. Vercel hospeda a interface; Google Drive continua sendo o armazenamento das imagens.

## Limites conhecidos

O CMS é um protótipo local: o catálogo não sincroniza entre dispositivos, o botão de arquivar não revoga links antigos e novas pastas ainda precisam ter seus IDs de imagem adicionados manualmente. O tipo “seleção” ainda não salva favoritos. Consulte [ROADMAP.md](ROADMAP.md) e [CLAUDE_HANDOFF.md](CLAUDE_HANDOFF.md).

## Desenvolvimento local

Sirva esta pasta como site estático (por exemplo, com `python3 -m http.server 8000`) e abra `/`. O painel fica em `/admin.html`. Não há dependências npm. Os arquivos `data/*.json` são exemplos vazios para não publicar IDs de fotos.

## Privacidade e segurança

Não comite IDs de arquivos/pastas do Drive, tokens OAuth, chaves de serviço ou informações identificáveis dos clientes. `noindex` reduz indexação, mas não protege uma URL pública. A publicação atual de demonstração do Vercel usa a pasta que Hemerson autorizou; o repositório de código não contém esses IDs.
