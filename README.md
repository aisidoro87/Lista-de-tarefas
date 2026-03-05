# 📝 Lista de Tarefas Simples

![Banner do Projeto](assets/lista-de-tarefas.png)

Uma aplicação web moderna e intuitiva para gerenciamento de tarefas, desenvolvida com foco em simplicidade e usabilidade, utilizando apenas HTML, CSS e JavaScript puro (Vanilla JS).

---

## ✨ Funcionalidades Principais

- **Adicionar Tarefas:** Campo de texto para inserir novas tarefas de forma rápida.
- **Editar Tarefas:** Edição do texto da tarefa diretamente na linha, sem a necessidade de pop-ups ou modais.
- **Concluir Tarefas:** Mova tarefas da lista de pendentes para uma seção de "Tarefas Concluídas", registrando automaticamente a data e a hora da conclusão.
- **Exclusão Segura:**
    - Remova tarefas pendentes com uma etapa de confirmação para evitar exclusões acidentais.
    - Exclua tarefas concluídas individualmente.
- **Limpeza em Massa:** Botão para remover todas as tarefas da lista de concluídas de uma só vez.
- **Validação de Entrada:** Mensagem de erro amigável é exibida caso o usuário tente adicionar uma tarefa vazia.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Para a estrutura semântica da página.
- **CSS3:** Para a estilização, layout (Flexbox) e design visual.
- **JavaScript (Vanilla):** Para toda a lógica, interatividade e manipulação do DOM.

---

## 📂 Como Executar

Não há necessidade de instalação de dependências. Basta seguir os passos abaixo:

1. Clone este repositório (se estiver no GitHub):
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. Navegue até a pasta do projeto.
3. Abra o arquivo `index.html` no seu navegador de preferência.

---

## 🏗️ Estrutura do Projeto
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