const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const lowPriorityList = document.getElementById('lowPriorityList');
const mediumPriorityList = document.getElementById('mediumPriorityList');
const highPriorityList = document.getElementById('highPriorityList');
const completedTaskList = document.getElementById('completedTaskList');
const errorMessage = document.getElementById('errorMessage');
const selectAllCompleted = document.getElementById('selectAllCompleted');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const priorityInput = document.getElementById('priorityInput');
let draggedTask = null; // Variável para armazenar a tarefa sendo arrastada
const lowPriorityColumn = document.getElementById('low-priority');
const mediumPriorityColumn = document.getElementById('medium-priority');
const highPriorityColumn = document.getElementById('high-priority');
const themeToggle = document.getElementById('themeToggle');                                                                        

let currentFilter = 'todas'; // Filtro ativo padrão

// Função para aplicar os filtros de tarefas (Todas, Pendentes, Concluídas)
function applyFilter(filter) {
    currentFilter = filter;

    const tasksContainer = document.querySelector('.tasks-container');
    const completedContainer = document.querySelector('.container-completed');

    // Atualiza a classe ativa nos botões de filtro
    document.querySelectorAll('.btn-filter').forEach(btn => {
        if (btn.classList.contains(currentFilter)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Controla a visibilidade dos contêineres de tarefas pendentes
    if (currentFilter === 'concluidas') {
        tasksContainer.style.display = 'none';
    } else {
        tasksContainer.style.display = 'flex';
    }

    // Controla a visibilidade do contêiner de tarefas concluídas
    if (currentFilter === 'pendentes') {
        completedContainer.style.display = 'none';
    } else {
        completedContainer.style.display = 'block';
    }
}

// Função para criar o nó de uma tarefa (o elemento <li> com seus botões)
function createTaskNode(text, initialPriority = null) {
    const li = document.createElement('li');

    li.draggable = true;// Permite arrastar a tarefa para reordenar ou mudar de coluna

    li.addEventListener('dragstart', () => { // Evento para iniciar o arrasto da tarefa                                            
            draggedTask = li; // Armazena a tarefa sendo arrastada                                                                     
        });  
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
    editBtn.setAttribute('aria-label', 'Editar tarefa');
    editBtn.className = 'action-btn edit-btn';
    editBtn.innerHTML = '&#9998;'; // Símbolo de lápis

    const finishEdit = (save) => {
        if (!li.classList.contains('editing')) return;

        li.classList.remove('editing');

        const input = li.querySelector('.edit-input');
        if (input) {
            const newText = input.value.trim();
            if (save && newText !== '') {
                span.textContent = newText;
            }
            input.remove();
        }

        span.style.display = '';
        editBtn.innerHTML = '&#9998;'; // Retorna o símbolo de lápis
        editBtn.setAttribute('aria-label', 'Editar tarefa');
        completeBtn.style.display = '';
        deleteBtn.style.display = '';
        saveTasks();
    };

    editBtn.onclick = () => {
        if (li.classList.contains('editing')) {
            finishEdit(true);
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

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    finishEdit(true);
                } else if (e.key === 'Escape') {
                    finishEdit(false);
                }
            });

            input.addEventListener('blur', (e) => {
                if (e.relatedTarget === editBtn) {
                    return;
                }
                finishEdit(true);
            });

            editBtn.innerHTML = '&#10004;';
            editBtn.setAttribute('aria-label', 'Salvar alteração');
            li.classList.add('editing');
        }
    };

    // Botão de Tarefa Concluída
    const completeBtn = document.createElement('button');
    completeBtn.className = 'action-btn complete-btn';
    completeBtn.innerHTML = '&#10004;'; // Símbolo de check
    completeBtn.setAttribute('aria-label', 'Concluir tarefa');

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

        // Adiciona a data de conclusão
        const completionDate = document.createElement('small');
        completionDate.className = 'completion-date';

        const agora = new Date();
        const data = agora.toLocaleDateString('pt-BR');
        const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        completionDate.textContent = `Tarefa concluída em ${data} às ${hora}`;

        completedActionsDiv.appendChild(completionDate);
        contentDiv.appendChild(completedActionsDiv);

        li.appendChild(contentDiv);

        completedTaskList.appendChild(li);
        updateCompletedActions();
        saveTasks();
    };

    // Botão de Excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('aria-label', 'Excluir tarefa')
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
    };

    saveTasks();

    if (currentFilter === 'concluidas') {
        applyFilter('todas');
    }

    taskInput.value = '';
    priorityInput.value = '';
    taskInput.focus();
}

// Função para salvar no Local Storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.priority-column li').forEach(li => {
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
};

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
            const priority = task.priority || 'low'; // Se a tarefa antiga não tiver prioridade, define como 'low'                                      
            const taskNode = createTaskNode(task.text, priority);
            if (priority === 'low') {
                lowPriorityList.appendChild(taskNode);
            } else if (priority === 'medium') {
                mediumPriorityList.appendChild(taskNode);
            } else if (priority === 'high') {
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

// --- Eventos de Drag & Drop para Baixa Prioridade ---                                                                            
    lowPriorityColumn.addEventListener('dragover', (e) => {                                                                            
        e.preventDefault(); // Permite que o elemento seja solto aqui                                                                  
    });                                                                                                                                
                                                                                                                                       
    lowPriorityColumn.addEventListener('dragenter', () => {                                                                            
        // Incrementa o contador de entrada da coluna (se não existir, inicia em 0)                                                    
        lowPriorityColumn.dragCounter = (lowPriorityColumn.dragCounter || 0) + 1;                                                      
        lowPriorityColumn.classList.add('drag-over');                                                                                  
    });                                                                                                                                
                                                                                                                                       
    lowPriorityColumn.addEventListener('dragleave', () => {                                                                            
        // Decrementa o contador ao sair                                                                                               
        lowPriorityColumn.dragCounter = (lowPriorityColumn.dragCounter || 0) - 1;                                                      
        // Só remove o estilo visual se saímos completamente da coluna e de todos os filhos (contador = 0)                             
        if (lowPriorityColumn.dragCounter === 0) {                                                                                     
            lowPriorityColumn.classList.remove('drag-over');                                                                           
        }                                                                                                                              
    });                                                                                                                                
                                                                                                                                       
    lowPriorityColumn.addEventListener('drop', () => {                                                                                 
        lowPriorityColumn.dragCounter = 0; // Reseta o contador ao soltar                                                              
        lowPriorityColumn.classList.remove('drag-over');                                                                               
        if (!draggedTask) return;                                                                                                      
                                                                                                                                       
        lowPriorityList.appendChild(draggedTask);                                                                                      
        draggedTask.classList.remove('priority-low', 'priority-medium', 'priority-high');                                              
        draggedTask.classList.add('priority-low');                                                                                     
        draggedTask.dataset.priority = 'low';                                                                                          
                                                                                                                                       
        saveTasks();                                                                                                                   
    });                                                                                                                                
                                                                                                                                       
    // --- Eventos de Drag & Drop para Média Prioridade ---                                                                            
    mediumPriorityColumn.addEventListener('dragover', (e) => {                                                                         
        e.preventDefault();                                                                                                            
    });                                                                                                                                
                                                                                                                                       
    mediumPriorityColumn.addEventListener('dragenter', () => {                                                                         
        mediumPriorityColumn.dragCounter = (mediumPriorityColumn.dragCounter || 0) + 1;                                                
        mediumPriorityColumn.classList.add('drag-over');                                                                               
    });                                                                                                                                
                                                                                                                                       
    mediumPriorityColumn.addEventListener('dragleave', () => {                                                                         
        mediumPriorityColumn.dragCounter = (mediumPriorityColumn.dragCounter || 0) - 1;                                                
        if (mediumPriorityColumn.dragCounter === 0) {                                                                                  
            mediumPriorityColumn.classList.remove('drag-over');                                                                        
        }                                                                                                                              
    });                                                                                                                                
                                                                                                                                       
    mediumPriorityColumn.addEventListener('drop', () => {                                                                              
        mediumPriorityColumn.dragCounter = 0;                                                                                          
        mediumPriorityColumn.classList.remove('drag-over');                                                                            
        if (!draggedTask) return;                                                                                                      
                                                                                                                                       
        mediumPriorityList.appendChild(draggedTask);                                                                                   
        draggedTask.classList.remove('priority-low', 'priority-medium', 'priority-high');                                              
        draggedTask.classList.add('priority-medium');                                                                                  
        draggedTask.dataset.priority = 'medium';                                                                                       
                                                                                                                                       
        saveTasks();                                                                                                                   
    });                                                                                                                                
                                                                                                                                       
    // --- Eventos de Drag & Drop para Alta Prioridade ---                                                                             
    highPriorityColumn.addEventListener('dragover', (e) => {                                                                           
        e.preventDefault();                                                                                                            
    });                                                                                                                                
                                                                                                                                       
    highPriorityColumn.addEventListener('dragenter', () => {                                                                           
        highPriorityColumn.dragCounter = (highPriorityColumn.dragCounter || 0) + 1;                                                    
        highPriorityColumn.classList.add('drag-over');                                                                                 
    });                                                                                                                                
                                                                                                                                       
    highPriorityColumn.addEventListener('dragleave', () => {                                                                           
        highPriorityColumn.dragCounter = (highPriorityColumn.dragCounter || 0) - 1;                                                    
        if (highPriorityColumn.dragCounter === 0) {                                                                                    
            highPriorityColumn.classList.remove('drag-over');                                                                          
        }                                                                                                                              
    });                                                                                                                                
                                                                                                                                       
    highPriorityColumn.addEventListener('drop', () => {                                                                                
        highPriorityColumn.dragCounter = 0;                                                                                            
        highPriorityColumn.classList.remove('drag-over');                                                                              
        if (!draggedTask) return;                                                                                                      
                                                                                                                                       
        highPriorityList.appendChild(draggedTask);                                                                                     
        draggedTask.classList.remove('priority-low', 'priority-medium', 'priority-high');                                              
        draggedTask.classList.add('priority-high');                                                                                    
        draggedTask.dataset.priority = 'high';                                                                                         
                                                                                                                                       
        saveTasks();                                                                                                                   
    });           

     // Verifica se o usuário tem alguma preferência salva no navegador                                                                 
    if (localStorage.getItem('theme') === 'dark') {                                                                                    
        document.body.classList.add('dark-mode');                                                                                      
        themeToggle.textContent = '☀️'; // Muda o ícone para o Sol no modo escuro                                                      
    }                                                                                                                                  
                                                                                                                                       
    themeToggle.addEventListener('click', () => {                                                                                      
        document.body.classList.toggle('dark-mode');                                                                                   
                                                                                                                                       
        if (document.body.classList.contains('dark-mode')) {                                                                           
            themeToggle.textContent = '☀️';                                                                                            
            localStorage.setItem('theme', 'dark'); // Salva preferência escuro                                                         
        } else {                                                                                                                       
            themeToggle.textContent = '🌙';                                                                                            
            localStorage.setItem('theme', 'light'); // Salva preferência claro                                                         
        }                                                                                                                              
    }); 

document.addEventListener('DOMContentLoaded', () => { // Carrega as tarefas do Local Storage ao iniciar a aplicação
    loadTasks();

    // Adiciona ouvintes de evento para os botões de filtro
    document.querySelector('.btn-filter.todas').addEventListener('click', () => applyFilter('todas'));
    document.querySelector('.btn-filter.pendentes').addEventListener('click', () => applyFilter('pendentes'));
    document.querySelector('.btn-filter.concluidas').addEventListener('click', () => applyFilter('concluidas'));

    applyFilter('todas'); // Inicializa aplicando o filtro "Todas"
    updateCompletedActions();
});