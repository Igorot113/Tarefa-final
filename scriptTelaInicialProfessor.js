document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis de DOM ---
    const elementoNomeProfessor = document.querySelector('.NomeProfessor');
    const btnLogout = document.getElementById('btnLogout');
    const btnAddAluno = document.getElementById('btnAddAluno');
    const tabelaAlunosBody = document.getElementById('tabelaAlunosBody');
    const listaTarefasUL = document.getElementById('listaTarefasUL');
    const resumoAulasDiv = document.getElementById('resumoAulas');

    // Formulário de Gerenciamento
    const inputCpfGerenciar = document.getElementById('inputCpfGerenciar');
    const selectStatus = document.getElementById('selectStatus');
    const btnSetStatus = document.getElementById('btnSetStatus');
    const selectDia = document.getElementById('selectDia');
    const inputMateria = document.getElementById('inputMateria');
    const btnAtribuirAula = document.getElementById('btnAtribuirAula');
    
    // Formulário de Tarefas
    const formAtribuirTarefa = document.getElementById('formAtribuirTarefa');
    const inputCpfTarefa = document.getElementById('cpfTarefa');
    const inputNomeTarefa = document.getElementById('nomeTarefa');


    // --- Funções de Ajuda para LocalStorage ---
    function getAlunos() {
        return JSON.parse(localStorage.getItem('alunos')) || [];
    }

    function saveAlunos(alunos) {
        localStorage.setItem('alunos', JSON.stringify(alunos));
    }

    function findAlunoIndexByCpf(cpf) {
        const alunos = getAlunos();
        return alunos.findIndex(aluno => aluno.cpf === cpf);
    }


    // --------------------------------------------------------------------------------
    // --- 1. VERIFICAÇÃO DE SESSÃO E INICIALIZAÇÃO ---
    // --------------------------------------------------------------------------------

    function inicializarTela() {
        const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
        
        if (!usuarioLogadoJSON) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            window.location.href = 'login.html';
            return;
        }

        const professor = JSON.parse(usuarioLogadoJSON);

        if (professor.tipo !== 'professor') {
            alert("Acesso não autorizado.");
            sessionStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
            return;
        }
        
        // Exibe o nome do professor
        elementoNomeProfessor.textContent = professor.nome;

        carregarDados();
    }
    
    // --------------------------------------------------------------------------------
    // --- 2. LÓGICA DE EVENTOS E FUNCIONALIDADES ---
    // --------------------------------------------------------------------------------

    // Evento de Logout
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('usuarioLogado');
        alert('Sessão encerrada.');
        window.location.href = 'login.html';
    });
    /*
    // Evento Adicionar Aluno (simples, usando prompt)
    btnAddAluno.addEventListener('click', () => {
        const nome = prompt("Digite o NOME do novo aluno:");
        const cpf = prompt("Digite o CPF do novo aluno (apenas números):");

        if (nome && cpf) {
            let alunos = getAlunos();
            if (findAlunoIndexByCpf(cpf) !== -1) {
                alert("Erro: Já existe um aluno cadastrado com este CPF.");
                return;
            }

            const novoAluno = {
                nome: nome.trim(),
                cpf: cpf.trim(),
                tipo: 'aluno', 
                statusAprovacao: 'Pendente',
                aulasAtribuidas: {}, 
                tarefasPendentes: []
            };

            alunos.push(novoAluno);
            saveAlunos(alunos);
            alert(`Aluno ${nome} cadastrado com sucesso!`);
            carregarDados(); // Atualiza a tela
        }
    });
    */
    // REQUISITO 5: Atribuir Tarefa
    formAtribuirTarefa.addEventListener('submit', (e) => {
        e.preventDefault();
        const cpf = inputCpfTarefa.value.trim();
        const nomeTarefa = inputNomeTarefa.value.trim();

        if (!cpf || !nomeTarefa) return alert("Preencha todos os campos.");

        let alunos = getAlunos();
        const alunoIndex = findAlunoIndexByCpf(cpf);

        if (alunoIndex === -1) return alert("Aluno com este CPF não encontrado.");

        alunos[alunoIndex].tarefasPendentes.push(nomeTarefa);
        saveAlunos(alunos);
        alert(`Tarefa "${nomeTarefa}" atribuída a ${alunos[alunoIndex].nome}.`);
        
        formAtribuirTarefa.reset();
        carregarDados();
    });

    // REQUISITO 4: Atualizar Status de Aprovação
    btnSetStatus.addEventListener('click', () => {
        const cpf = inputCpfGerenciar.value.trim();
        const novoStatus = selectStatus.value;

        if (!cpf || !novoStatus) return alert("Preencha o CPF e selecione o Status.");

        let alunos = getAlunos();
        const alunoIndex = findAlunoIndexByCpf(cpf);

        if (alunoIndex === -1) return alert("Aluno com este CPF não encontrado.");

        alunos[alunoIndex].statusAprovacao = novoStatus;
        saveAlunos(alunos);
        alert(`Status de ${alunos[alunoIndex].nome} alterado para ${novoStatus}.`);
        
        inputCpfGerenciar.value = '';
        selectStatus.value = '';
        carregarDados();
    });

    // REQUISITO 2: Atribuir Aula por Dia e Matéria
    btnAtribuirAula.addEventListener('click', () => {
        const cpf = inputCpfGerenciar.value.trim();
        const dia = selectDia.value;
        const materia = inputMateria.value.trim();

        if (!cpf || !dia || !materia) return alert("Preencha o CPF, Dia e Matéria.");

        let alunos = getAlunos();
        const alunoIndex = findAlunoIndexByCpf(cpf);

        if (alunoIndex === -1) return alert("Aluno com este CPF não encontrado.");

        // Usa o dia da semana como chave e a matéria como valor
        alunos[alunoIndex].aulasAtribuidas[dia] = materia;
        saveAlunos(alunos);
        alert(`Aula de ${materia} atribuída para ${alunos[alunoIndex].nome} na ${dia}.`);
        
        inputCpfGerenciar.value = '';
        selectDia.value = '';
        inputMateria.value = '';
        carregarDados();
    });


    // --------------------------------------------------------------------------------
    // --- 3. CARREGAMENTO DINÂMICO DE DADOS ---
    // --------------------------------------------------------------------------------
    
    function carregarDados() {
        const alunos = getAlunos();
        tabelaAlunosBody.innerHTML = '';
        listaTarefasUL.innerHTML = '';
        resumoAulasDiv.innerHTML = '';

        if (alunos.length === 0) {
            tabelaAlunosBody.innerHTML = '<tr><td colspan="4">Nenhum aluno cadastrado.</td></tr>';
            listaTarefasUL.innerHTML = '<li>Nenhuma tarefa pendente.</li>';
            resumoAulasDiv.innerHTML = '<p>Nenhuma aula atribuída.</p>';
            return;
        }

        // CARREGAR TABELA DE ALUNOS
        alunos.forEach(aluno => {
            const row = tabelaAlunosBody.insertRow();
            row.insertCell().textContent = aluno.nome;
            row.insertCell().textContent = aluno.cpf;
            row.insertCell().textContent = aluno.statusAprovacao || 'Pendente'; 
            
            // Célula de ações (Apenas informativo, as ações são feitas pelo formulário)
            const cellAcoes = row.insertCell();
            cellAcoes.textContent = "Ações acima";
        });

        
        // CARREGAR LISTA DE TAREFAS PENDENTES (Geral)
        let totalTarefas = 0;
        alunos.forEach(aluno => {
            aluno.tarefasPendentes.forEach(tarefa => {
                const li = document.createElement('li');
                li.textContent = `${aluno.nome} (${aluno.cpf}): ${tarefa}`;
                listaTarefasUL.appendChild(li);
                totalTarefas++;
            });
        });

        if (totalTarefas === 0) {
            listaTarefasUL.innerHTML = '<li>Nenhuma tarefa pendente.</li>';
        }

        
        // CARREGAR RESUMO DE AULAS
        let aulasHtml = '<ul>';
        alunos.forEach(aluno => {
            const aulas = aluno.aulasAtribuidas;
            const diasAtribuidos = Object.keys(aulas).length;
            
            if (diasAtribuidos > 0) {
                aulasHtml += `<li><strong>${aluno.nome} (${aluno.cpf}):</strong>`;
                aulasHtml += '<ul>';
                for (const dia in aulas) {
                    aulasHtml += `<li>${dia}: ${aulas[dia]}</li>`;
                }
                aulasHtml += '</ul></li>';
            }
        });
        aulasHtml += '</ul>';
        
        if (aulasHtml === '<ul></ul>') {
            resumoAulasDiv.innerHTML = '<p>Nenhuma aula atribuída a nenhum aluno.</p>';
        } else {
            resumoAulasDiv.innerHTML = aulasHtml;
        }
    }

    // Inicia a aplicação
    inicializarTela();
});