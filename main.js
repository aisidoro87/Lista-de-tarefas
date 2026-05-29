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
const priorityInput = document.getElementById('priorityInput');

// Função para mostrar/esconder a seção de tarefas não priorizadas
function updateUnprioritizedVisibility() {
    unprioritizedContainer.style.display = unprioritizedTaskList.children.length > 0 ? 'block' : 'none';
}

// Função para criar o nó de uma tarefa (o elemento <li> com seus botões)
function createTaskNode(text, initialPriority = null) {
    const li = document.createElement('li');
    if (initialPriority) {
        li.classList.add(`priority-${initialPriority}`);
        li.dataset.priority = initialPriority;
    } else {
        li.dataset.priority = '';
    }

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
                completeBtn.style.display = '';
                deleteBtn.style.display = '';
                saveTasks();
            }
        } else {
            span.style.display = 'none';
            completeBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
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
        divActions.remove();

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'completed-checkbox';
        li.prepend(checkbox);

        // Container para organizar Texto e Data em coluna
        const contentDiv = document.createElement('div');
        contentDiv.className = 'completed-task-content';
        
        // Move o span existente para o container
        contentDiv.appendChild(span);

        const completedActionsDiv = document.createElement('div');
        completedActionsDiv.className = 'actions';

        const completionDate = document.createElement('small');
        completionDate.className = 'completion-date';
        completionDate.textContent = new Date().toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        completedActionsDiv.appendChild(completionDate);
        contentDiv.appendChild(completedActionsDiv);
        
        li.appendChild(contentDiv);

        completedTaskList.appendChild(li);
        updateUnprioritizedVisibility();
        updateCompletedActions();
        saveTasks();
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
            saveTasks();
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

    li.appendChild(span);
    li.appendChild(divActions);

    return li;
}

// Função para adicionar tarefa
function addTask() {
    const text = taskInput.value.trim();
    const priority = priorityInput.value;

    if (text === '') {
        errorMessage.textContent = 'Por favor, digite uma tarefa.';
        return;
    }

    if (priority === '') {
        errorMessage.textContent = 'Por favor, escolha uma prioridade.';
        return;
    }

    errorMessage.textContent = '';

    const taskNode = createTaskNode(text, priority);
    
    if (priority === 'low') {
        lowPriorityList.appendChild(taskNode);
    } else if (priority === 'medium') {
        mediumPriorityList.appendChild(taskNode);
    } else if (priority === 'high') {
        highPriorityList.appendChild(taskNode);
    } else {
        unprioritizedTaskList.appendChild(taskNode);
    }

    updateUnprioritizedVisibility(); 
    saveTasks(); 

    taskInput.value = '';
    taskInput.focus();
}

// Função para salvar no Local Storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#unprioritizedTaskList li, .priority-column li').forEach(li => {
        const textElement = li.querySelector('.task-text');
        if (textElement) {
            tasks.push({
                text: textElement.textContent,
                completed: false,
                priority: li.dataset.priority || ''
            });
        }
    });
    document.querySelectorAll('#completedTaskList li').forEach(li => {
        const textElement = li.querySelector('.task-text');
        const dateElement = li.querySelector('.completion-date');
        if (textElement && dateElement) {
            tasks.push({
                text: textElement.textContent,
                completed: true,
                completionDate: dateElement.textContent,
                priority: li.dataset.priority || ''
            });
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar do Local Storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => {
        if (task.completed) {
            const li = document.createElement('li');
            li.className = 'completed-task';

            if (task.priority) {
                li.classList.add(`priority-${task.priority}`);
                li.dataset.priority = task.priority;
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'completed-checkbox';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'completed-task-content';

            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'actions';

            const dateSmall = document.createElement('small');
            dateSmall.className = 'completion-date';
            dateSmall.textContent = task.completionDate;

            actionsDiv.appendChild(dateSmall);
            contentDiv.appendChild(span);
            contentDiv.appendChild(actionsDiv);
            
            li.appendChild(checkbox);
            li.appendChild(contentDiv);

            completedTaskList.appendChild(li);
        } else {
            const taskNode = createTaskNode(task.text, task.priority || null);
            if (!task.priority) {
                unprioritizedTaskList.appendChild(taskNode);
            } else if (task.priority === 'low') {
                lowPriorityList.appendChild(taskNode);
            } else if (task.priority === 'medium') {
                mediumPriorityList.appendChild(taskNode);
            } else if (task.priority === 'high') {
                highPriorityList.appendChild(taskNode);
            }
        }
    });
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

taskInput.addEventListener('input', () => {
    if (errorMessage.textContent) errorMessage.textContent = '';
});

function updateCompletedActions() {
    const checkboxes = completedTaskList.querySelectorAll('.completed-checkbox');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

    selectAllCompleted.style.display = checkboxes.length > 0 ? 'inline-block' : 'none';
    deleteSelectedBtn.style.display = checkedCount > 0 ? 'inline-block' : 'none';

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

selectAllCompleted.addEventListener('change', () => {
    const checkboxes = completedTaskList.querySelectorAll('.completed-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = selectAllCompleted.checked;
    });
    updateCompletedActions();
});

deleteSelectedBtn.addEventListener('click', () => {
    const checkedCheckboxes = completedTaskList.querySelectorAll('.completed-checkbox:checked');
    if (checkedCheckboxes.length > 0 && confirm(`Tem certeza que deseja excluir as ${checkedCheckboxes.length} tarefas selecionadas?`)) {
        checkedCheckboxes.forEach(cb => {
            cb.closest('li').remove();
        });
        saveTasks();
        updateCompletedActions();
    }
});

completedTaskList.addEventListener('change', (e) => {
    if (e.target.matches('.completed-checkbox')) {
        updateCompletedActions();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateCompletedActions();
    updateUnprioritizedVisibility();
});