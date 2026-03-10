const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const lowPriorityList = document.getElementById('lowPriorityList');
const mediumPriorityList = document.getElementById('mediumPriorityList');
const highPriorityList = document.getElementById('highPriorityList');
const unprioritizedTaskList = document.getElementById('unprioritizedTaskList');
const unprioritizedContainer = document.getElementById('unprioritized-container');
const completedTaskList = document.getElementById('completedTaskList');
const errorMessage = document.getElementById('errorMessage');
const selectAllCompleted = document.getElementById('selectAllCompleted');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

// Função para mostrar/esconder a seção de tarefas não priorizadas
function updateUnprioritizedVisibility() {
    unprioritizedContainer.style.display = unprioritizedTaskList.children.length > 0 ? 'block' : 'none';
}

// Função para criar o nó de uma tarefa (o elemento <li> com seus botões)
function createTaskNode(text, initialPriority = null) { // O padrão agora é nulo (não priorizado)
    const li = document.createElement('li');
    if (initialPriority) {
        li.classList.add(`priority-${initialPriority}`);
        li.dataset.priority = initialPriority;
    } else {
        li.dataset.priority = ''; // Representa não priorizado
    }
    
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = text;
    
    const divActions = document.createElement('div');
    divActions.className = 'actions';

    // Priority Selector (new element)
    const prioritySelect = document.createElement('select');
    prioritySelect.className = 'priority-select';
    prioritySelect.innerHTML = `
        <option value="" disabled selected>Priorizar</option>
        <option value="low">Baixa</option>
        <option value="medium">Média</option>
        <option value="high">Alta</option>
    `;
    if (initialPriority) {
        prioritySelect.value = initialPriority;
    }

    prioritySelect.addEventListener('change', (e) => {
        const newPriority = e.target.value;
        const oldPriority = li.dataset.priority;

        if (newPriority !== oldPriority) {
            if (oldPriority) {
                li.classList.remove(`priority-${oldPriority}`);
            }
            li.classList.add(`priority-${newPriority}`);
            li.dataset.priority = newPriority;

            // Move the task to the correct list
            let targetList;
            if (newPriority === 'low') targetList = lowPriorityList;
            else if (newPriority === 'medium') targetList = mediumPriorityList;
            else targetList = highPriorityList; // high
            
            targetList.appendChild(li); // Appends to the end of the new list

            updateUnprioritizedVisibility();
            saveTasks(); // Save after priority change
        }
    });

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
                prioritySelect.style.display = ''; // Mostra o seletor de prioridade novamente
                // Mostra os outros botões novamente
                completeBtn.style.display = '';
                deleteBtn.style.display = '';
                saveTasks(); // Salva após editar
            }
        } else {
            span.style.display = 'none';
            completeBtn.style.display = 'none'; // Esconde o botão de concluir
            prioritySelect.style.display = 'none'; // Esconde o seletor de prioridade durante a edição
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
        li.querySelector('.priority-select').remove(); // Remove o seletor de prioridade da tarefa concluída
        li.classList.add('completed-task');
        divActions.remove(); // Remove os botões de ação originais

        // Cria o checkbox para seleção individual
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'completed-checkbox';
        li.prepend(checkbox); // Adiciona o checkbox no início do <li>

        // Cria um novo container para os itens da tarefa concluída
        const completedActionsDiv = document.createElement('div');
        completedActionsDiv.className = 'actions'; // Reutiliza a classe para o layout flex

        // Cria a data de conclusão
        const completionDate = document.createElement('small');
        completionDate.className = 'completion-date';
        completionDate.textContent = new Date().toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        completedActionsDiv.appendChild(completionDate);
        li.appendChild(completedActionsDiv);

        completedTaskList.appendChild(li);
        updateUnprioritizedVisibility();
        updateCompletedActions();
        saveTasks(); // Salva após concluir
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

        confirmDiv.querySelector('.btn-yes').onclick = () => {
            li.remove();
            updateUnprioritizedVisibility();
            saveTasks(); // Salva após excluir
        };
        confirmDiv.querySelector('.btn-no').onclick = () => {
            confirmDiv.remove();
            children.forEach(child => child.style.display = '');
            if (li.classList.contains('editing')) span.style.display = 'none';
        };
    };

    divActions.appendChild(editBtn);
    divActions.appendChild(completeBtn);
    divActions.appendChild(deleteBtn);

    li.appendChild(prioritySelect);
    li.appendChild(span);
    li.appendChild(divActions);
    
    return li;
}

// Função para adicionar tarefa (chamada pelo botão/Enter)
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        errorMessage.textContent = 'Por favor, digite uma tarefa.';
        return;
    }
    errorMessage.textContent = ''; // Limpa a mensagem de erro se houver

    // Adiciona a tarefa à lista de não priorizadas por padrão
    const taskNode = createTaskNode(text, null);
    unprioritizedTaskList.appendChild(taskNode);

    updateUnprioritizedVisibility(); // Mostra o container se estiver oculto

    saveTasks(); // Salva ao adicionar nova tarefa

    taskInput.value = '';
    taskInput.focus();
}

// Função para salvar todas as tarefas no Local Storage
function saveTasks() {
    const tasks = [];
    // Salva tarefas pendentes
    document.querySelectorAll('#unprioritizedTaskList li, .task-list-column li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: false,
            priority: li.dataset.priority
        });
    });
    // Salva tarefas concluídas
    document.querySelectorAll('#completedTaskList li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: true,
            completionDate: li.querySelector('.completion-date').textContent
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar tarefas do Local Storage ao iniciar
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => {
        if (task.completed) {
            const li = document.createElement('li');
            li.className = 'completed-task';
            // Usar innerHTML aqui é seguro pois os dados vêm do nosso próprio localStorage
            li.innerHTML = `
                <div class="completed-task-content">
                    <span class="task-text">${task.text}</span>
                    <div class="actions">
                        <small class="completion-date">${task.completionDate}</small>
                    </div>
                </div>
                <input type="checkbox" class="completed-checkbox">
            `;
            completedTaskList.appendChild(li);
        } else {
            const taskNode = createTaskNode(task.text, task.priority || null);
            if (!task.priority) {
                unprioritizedTaskList.appendChild(taskNode);
            } else if (task.priority === 'low') {
                lowPriorityList.appendChild(taskNode);
            } else if (task.priority === 'medium') {
                mediumPriorityList.appendChild(taskNode);
            } else { // high
                highPriorityList.appendChild(taskNode);
            }
        }
    });
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

// Função para atualizar a UI de ações em massa das tarefas concluídas
function updateCompletedActions() {
    const checkboxes = completedTaskList.querySelectorAll('.completed-checkbox');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

    // Mostra ou esconde o checkbox "selecionar todos" se houver tarefas concluídas
    selectAllCompleted.style.display = checkboxes.length > 0 ? 'inline-block' : 'none';

    // Mostra ou esconde o botão de excluir selecionados
    deleteSelectedBtn.style.display = checkedCount > 0 ? 'inline-block' : 'none';

    // Atualiza o estado do checkbox "selecionar todos"
    if (checkboxes.length > 0 && checkedCount === checkboxes.length) {
        selectAllCompleted.checked = true;
        selectAllCompleted.indeterminate = false;
    } else if (checkedCount > 0) {
        selectAllCompleted.checked = false;
        selectAllCompleted.indeterminate = true;
    } else {
        selectAllCompleted.checked = false;
        selectAllCompleted.indeterminate = false;
    }
}

// Evento para o checkbox "selecionar todos"
selectAllCompleted.addEventListener('change', () => {
    const checkboxes = completedTaskList.querySelectorAll('.completed-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = selectAllCompleted.checked;
    });
    updateCompletedActions();
});

// Evento para o botão "excluir selecionados"
deleteSelectedBtn.addEventListener('click', () => {
    const checkedCheckboxes = completedTaskList.querySelectorAll('.completed-checkbox:checked');
    if (checkedCheckboxes.length > 0 && confirm(`Tem certeza que deseja excluir as ${checkedCheckboxes.length} tarefas selecionadas?`)) {
        checkedCheckboxes.forEach(cb => {
            cb.closest('li').remove();
        });
        saveTasks(); // Salva após excluir selecionados
        updateCompletedActions();
    }
});

// Delegação de evento para os checkboxes individuais
completedTaskList.addEventListener('change', (e) => {
    if (e.target.matches('.completed-checkbox')) {
        updateCompletedActions();
    }
});

// Carrega as tarefas salvas e atualiza a UI ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateCompletedActions();
    updateUnprioritizedVisibility();
});