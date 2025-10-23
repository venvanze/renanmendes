# Como Editar o Conteúdo do Site

## 📝 Visão Geral

Todo o conteúdo do site pode ser editado facilmente através do arquivo `/hooks/useContent.js`. Basta modificar o objeto `SITE_CONTENT` e as mudanças aparecerão automaticamente no site.

## 🔧 Como Editar

### 1. Header (Cabeçalho)
```javascript
header: {
  name: "Seu Nome Aqui",           // Nome principal
  subtitle: "Sua profissão",       // Subtítulo/profissão
  navigation: ["Item1", "Item2"],  // Itens do menu
  contactButton: "Texto do Botão"  // Texto do botão de contato
}
```

### 2. Hero (Seção Principal)
```javascript
hero: {
  title: ["Linha 1", "Linha 2", "Linha 3"],  // Título principal (array)
  backgroundVideo: "URL_DO_YOUTUBE_EMBED"     // Vídeo de fundo
}
```

### 3. About (Sobre)
```javascript
about: {
  text: "Seu texto de apresentação aqui..."
}
```

### 4. Industries (Indústrias)
```javascript
industries: {
  text: "Texto sobre as indústrias que você atende..."
}
```

### 5. Video Types (Tipos de Vídeo)
```javascript
videoTypes: {
  types: ["Tipo 1", "Tipo 2", "Tipo 3", "Tipo 4"]
}
```

### 6. Highlights (Destaques - Vídeos)
```javascript
highlights: {
  title: "Título da Seção",
  videos: [
    {
      id: "id-unico",
      title: "Título do Vídeo",
      description: "Descrição detalhada...",
      thumbnail: "URL_DA_THUMBNAIL",
      youtubeUrl: "URL_DO_YOUTUBE",
      publishDate: "15 Mar 2024",
      duration: "3:42",
      category: "Categoria",
      tags: ["tag1", "tag2"]
    }
    // Adicione mais vídeos aqui...
  ]
}
```

### 7. Projects (Projetos)
```javascript
projects: {
  title: "Título da Seção",
  projects: [
    {
      title: "Nome do Projeto",
      date: "Mar 2024",
      image: "nome-da-imagem"  // Use os nomes mapeados no código
    }
    // Adicione mais projetos aqui...
  ]
}
```

**Imagens disponíveis para projetos:**
- `performance-musical`
- `documentario-natural`
- `produto-tech`
- `drama-teatral`
- `viagem-cultural`
- `reuniao-corporativa`
- `casamento-especial`
- `animacao-criativa`
- `estudio-edicao`

### 8. Testimonials (Depoimentos)
```javascript
testimonials: {
  title: "Título da Seção",
  testimonials: [
    {
      name: "Nome do Cliente",
      role: "Cargo/Função",
      quote: "Depoimento do cliente...",
      avatar: "nome-do-avatar"  // Use os nomes mapeados
    }
    // Adicione mais depoimentos aqui...
  ]
}
```

**Avatars disponíveis:**
- `lydia-marlowe`
- `arjun-patel`
- `sofia-lin`
- `carlos-gomez`
- `emma-white`
- `noah-kim`

### 9. Footer (Rodapé)
```javascript
footer: {
  copyright: "2025 - Seu Nome - Sua profissão",
  contactButton: "Texto do Botão"
}
```

## 🎥 Como Adicionar Vídeos do YouTube

Para adicionar um novo vídeo:

1. Copie a URL do vídeo do YouTube (ex: `https://www.youtube.com/watch?v=ABC123`)
2. O sistema automaticamente extrairá:
   - Thumbnail em alta qualidade
   - ID do vídeo para embed
   - URL para assistir

3. Adicione no array `videos`:
```javascript
{
  id: "meu-video-novo",
  title: "Título do Vídeo",
  description: "Descrição completa...",
  youtubeUrl: "https://www.youtube.com/watch?v=ABC123",
  publishDate: "15 Jan 2024",
  duration: "5:30",
  category: "Categoria",
  tags: ["tag1", "tag2"]
}
```

## 🔄 Aplicar Mudanças

1. Edite o arquivo `/hooks/useContent.js`
2. Modifique o objeto `SITE_CONTENT`
3. Salve o arquivo
4. As mudanças aparecerão automaticamente no site

## 💡 Dicas

- **URLs do YouTube**: Cole a URL completa, o sistema extrai automaticamente a thumbnail
- **Durações**: Use formato "MM:SS" ou "HH:MM:SS"
- **Datas**: Use formato "DD MMM YYYY" (ex: "15 Mar 2024")
- **Categorias**: Mantenha consistência nos nomes
- **Descrições**: Seja descritivo para melhor SEO e experiência do usuário

## ⚠️ Importante

- Mantenha a estrutura JSON válida (vírgulas, aspas, etc.)
- Teste sempre após as modificações
- Use o botão "Refresh" no ambiente de desenvolvimento se necessário
- Mantenha backups do conteúdo antes de grandes mudanças