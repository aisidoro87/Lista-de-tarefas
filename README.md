# 📝 Lista de Tarefas Simples

![Banner do Projeto](assets/lista-de-tarefas.png)

Uma aplicação web moderna e intuitiva para gerenciamento de tarefas, desenvolvida com foco em simplicidade, usabilidade e acessibilidade, utilizando apenas HTML, CSS e JavaScript puro (Vanilla JS).

---

## ✨ Funcionalidades Principais

- **Adicionar Tarefas:** Campo de texto com validação e seleção obrigatória de prioridades.
- **Organização por Prioridade:** Colunas visuais para prioridades (Baixa, Média e Alta) com suporte para arrastar e soltar (*drag and drop*).
- **Editar Tarefas:** Edição rápida do texto da tarefa diretamente na linha, alterando a descrição acessível de forma dinâmica.
- **Concluir Tarefas:** Mova tarefas para a seção de "Tarefas Concluídas", registrando automaticamente a data e a hora da conclusão.
- **Filtros Inteligentes:** Botões para alternar a exibição da tela entre "Todas", "Pendentes" e "Concluídas".
- **Exclusão Segura:**
    - Confirmação de segurança ao excluir tarefas pendentes para evitar exclusões acidentais.
    - Seleção múltipla e exclusão em lote para tarefas concluídas.
- **Persistência de Dados:** Salvamento automático de todas as tarefas no `localStorage` do navegador.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico:** Estrutura bem definida e hierarquia de títulos otimizada.
- **CSS3:** Estilização responsiva (Grid/Flexbox), transições suaves e uso de variáveis CSS (`:root`) para padronização da paleta de cores.
- **JavaScript (Vanilla JS):** Manipulação dinâmica de elementos no DOM, eventos interativos e persistência de dados.
- **Acessibilidade (a11y):** Inclusão de rótulos descritivos (`aria-label`) para leitores de tela e ocultação visual de textos de suporte com a classe `.sr-only`, garantindo usabilidade inclusiva para todos os usuários.

---

## 📂 Estrutura do Projeto
```
/
├── assets/
│   └── lista-de-tarefas.png
├── .gitignore
├── index.html
├── main.js
├── README.md
└── style.css
```

---

## 🚀 Como Executar

Não há necessidade de instalação de dependências complexas. Basta seguir os passos abaixo:

1. Abra a pasta do projeto em sua máquina local.
2. Dê um duplo clique no arquivo `index.html` para abri-lo diretamente no seu navegador web preferido.

---

## 🌐 Desenvolvido com ☕ e ❤️ por Anderson Isidoro