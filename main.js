const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const completedTaskList = document.getElementById('completedTaskList');
const errorMessage = document.getElementById('errorMessage');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Função para adicionar tarefa
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        errorMessage.textContent = 'Por favor, digite uma tarefa.';
        return;
    }
    errorMessage.textContent = ''; // Limpa a mensagem de erro se houver

    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = text;
    
    const divActions = document.createElement('div');
    divActions.className = 'actions';

    // Botão de Editar
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.innerHTML = '&#9998;'; // Símbolo de lápis
    editBtn.onclick = () => {
        if (li.classList.contains('editing')) {
            const input = li.querySelector('.edit-input');
            const newText = input.value.trim();
            
            if (newText !== '') {
                span.textContent = newText;
                input.remove();
                span.style.display = '';
                editBtn.innerHTML = '&#9998;';
                li.classList.remove('editing');
                // Mostra os outros botões novamente
                completeBtn.style.display = '';
                deleteBtn.style.display = '';
            }
        } else {
            span.style.display = 'none';
            completeBtn.style.display = 'none'; // Esconde o botão de concluir
            deleteBtn.style.display = 'none';   // Esconde o botão de excluir
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'edit-input';
            input.value = span.textContent;
            li.insertBefore(input, divActions);
            input.focus();
            editBtn.innerHTML = '&#10004;';
            li.classList.add('editing');
        }
    };

    // Botão de Tarefa Concluída
    const completeBtn = document.createElement('button');
    completeBtn.className = 'action-btn complete-btn';
    completeBtn.innerHTML = '&#10004;'; // Símbolo de check
    completeBtn.onclick = () => {
        li.classList.add('completed-task');
        divActions.remove(); // Remove os botões de ação originais

        // Cria um novo container para os itens da tarefa concluída
        const completedActionsDiv = document.createElement('div');
        completedActionsDiv.className = 'actions'; // Reutiliza a classe para o layout flex

        // Cria a data de conclusão
        const completionDate = document.createElement('small');
        completionDate.className = 'completion-date';
        completionDate.textContent = new Date().toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Cria o botão de excluir para a tarefa concluída
        const singleDeleteBtn = document.createElement('button');
        singleDeleteBtn.className = 'action-btn delete-btn';
        singleDeleteBtn.innerHTML = '&#128465;';
        singleDeleteBtn.onclick = () => {
            if (confirm('Tem certeza que deseja excluir esta tarefa concluída?')) {
                li.remove();
            }
        };

        completedActionsDiv.appendChild(completionDate);
        completedActionsDiv.appendChild(singleDeleteBtn);
        li.appendChild(completedActionsDiv);

        completedTaskList.appendChild(li);
    };

    // Botão de Excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '&#128465;'; // Símbolo de lixeira
    deleteBtn.onclick = () => {
        const children = Array.from(li.children);
        children.forEach(child => child.style.display = 'none');

        const confirmDiv = document.createElement('div');
        confirmDiv.className = 'confirmation-box';
        confirmDiv.innerHTML = `
            <span>Tem certeza que deseja excluir?</span>
            <div>
                <button class="confirm-btn btn-no">Não</button>
                <button class="confirm-btn btn-yes">Sim</button>
            </div>
        `;
        li.appendChild(confirmDiv);

        confirmDiv.querySelector('.btn-yes').onclick = () => li.remove();
        confirmDiv.querySelector('.btn-no').onclick = () => {
            confirmDiv.remove();
            children.forEach(child => child.style.display = '');
            if (li.classList.contains('editing')) span.style.display = 'none';
        };
    };

    divActions.appendChild(editBtn);
    divActions.appendChild(completeBtn);
    divActions.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(divActions);
    
    taskList.appendChild(li);
    taskInput.value = '';
    taskInput.focus();
}

addBtn.addEventListener('click', addTask);

// Permitir adicionar com a tecla Enter
taskInput.addEventListener('keypress', (e) => { 
    if(e.key === 'Enter') addTask(); 
});

// Limpar mensagem de erro ao digitar
taskInput.addEventListener('input', () => {
    if (errorMessage.textContent) errorMessage.textContent = '';
});

// Limpar todas as tarefas concluídas
clearCompletedBtn.addEventListener('click', () => {
    if (completedTaskList.children.length > 0 && confirm('Tem certeza que deseja limpar todas as tarefas concluídas?')) {
        completedTaskList.innerHTML = '';
    }
});