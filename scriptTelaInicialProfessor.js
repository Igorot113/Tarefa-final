document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis de DOM (mantidas) ---
    const elementoNomeProfessor = document.querySelector('.NomeProfessor');
    const btnLogout = document.getElementById('btnLogout');
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

    // --- FUNÇÃO DE HASH SHA-256 (ASSÍNCRONA) ---
    async function hashSHA256(string) {
        if (!string) return '';
        const msgUint8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    // ----------------------------------------------------

    // --- Funções de Ajuda para LocalStorage ---
    function getAlunos() {
        return JSON.parse(localStorage.getItem('alunos')) || [];
    }

    function saveAlunos(alunos) {
        localStorage.setItem('alunos', JSON.stringify(alunos));
    }

    // ATENÇÃO: AGORA É UMA FUNÇÃO ASSÍNCRONA E PROCURA POR 'cpfHash'
    async function findAlunoIndexByCpf(cpf) {
        if (!cpf) return -1;
        const alunos = getAlunos();
        const cpfHasheado = await hashSHA256(cpf); // Hashea o CPF digitado
        // Busca pelo campo 'cpfHash'
        return alunos.findIndex(aluno => aluno.cpfHash === cpfHasheado); 
    }


    // --------------------------------------------------------------------------------
    // --- 1. VERIFICAÇÃO DE SESSÃO E INICIALIZAÇÃO ---
    // --------------------------------------------------------------------------------

    // A função inicializarTela pode continuar síncrona, mas pode chamar uma função assíncrona
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
        
        elementoNomeProfessor.textContent = professor.nome;

        carregarDados();
    }
    
    // --------------------------------------------------------------------------------
    // --- 2. LÓGICA DE EVENTOS E FUNCIONALIDADES (AGORA ASSÍNCRONA) ---
    // --------------------------------------------------------------------------------

    // Evento de Logout (mantido síncrono)
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('usuarioLogado');
        alert('Sessão encerrada.');
        window.location.href = 'login.html';
    });

    // REQUISITO 5: Atribuir Tarefa (AGORA ASYNC)
    formAtribuirTarefa.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cpf = inputCpfTarefa.value.trim();
        const nomeTarefa = inputNomeTarefa.value.trim();

        if (!cpf || !nomeTarefa) return alert("Preencha todos os campos.");

        let alunos = getAlunos();
        // ATENÇÃO: USA await
        const alunoIndex = await findAlunoIndexByCpf(cpf); 

        if (alunoIndex === -1) return alert("Aluno com este CPF não encontrado.");

        alunos[alunoIndex].tarefasPendentes.push(nomeTarefa);
        saveAlunos(alunos);
        alert(`Tarefa "${nomeTarefa}" atribuída a ${alunos[alunoIndex].nome}.`);
        
        formAtribuirTarefa.reset();
        carregarDados();
    });

    // REQUISITO 4: Atualizar Status de Aprovação (AGORA ASYNC)
    btnSetStatus.addEventListener('click', async () => {
        const cpf = inputCpfGerenciar.value.trim();
        const novoStatus = selectStatus.value;

        if (!cpf || !novoStatus) return alert("Preencha o CPF e selecione o Status.");

        let alunos = getAlunos();
        // ATENÇÃO: USA await
        const alunoIndex = await findAlunoIndexByCpf(cpf); 

        if (alunoIndex === -1) return alert("Aluno com este CPF não encontrado.");

        alunos[alunoIndex].statusAprovacao = novoStatus;
        saveAlunos(alunos);
        alert(`Status de ${alunos[alunoIndex].nome} alterado para ${novoStatus}.`);
        
        inputCpfGerenciar.value = '';
        selectStatus.value = '';
        carregarDados();
    });

    // REQUISITO 2: Atribuir Aula por Dia e Matéria (AGORA ASYNC)
    btnAtribuirAula.addEventListener('click', async () => {
        const cpf = inputCpfGerenciar.value.trim();
        const dia = selectDia.value;
        const materia = inputMateria.value.trim();

        if (!cpf || !dia || !materia) return alert("Preencha o CPF, Dia e Matéria.");

        let alunos = getAlunos();
        // ATENÇÃO: USA await
        const alunoIndex = await findAlunoIndexByCpf(cpf); 

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
    // --- 3. CARREGAMENTO DINÂMICO DE DADOS (Mantido Síncrono) ---
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
            // ATENÇÃO: Não exibe o CPF (hash) para o usuário final, apenas o nome.
            // Se precisar de uma referência, você pode exibir uma versão parcial ou manter o campo invisível.
            // Por segurança, NUNCA exiba o hash completo.
            row.insertCell().textContent = aluno.cpfHash ? 'Hashed (Seguro)' : 'Erro: CPF não hasheado!'; 
            row.insertCell().textContent = aluno.statusAprovacao || 'Pendente'; 
            
            const cellAcoes = row.insertCell();
            cellAcoes.textContent = "Ações acima";
        });
        
        // ... (o restante da função carregarDados permanece o mesmo) ...

        // CARREGAR LISTA DE TAREFAS PENDENTES (Geral)
        let totalTarefas = 0;
        alunos.forEach(aluno => {
            aluno.tarefasPendentes.forEach(tarefa => {
                const li = document.createElement('li');
                // ATENÇÃO: Usando 'Hashed' ou outro identificador, se necessário.
                li.textContent = `${aluno.nome}: ${tarefa}`; 
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
                aulasHtml += `<li><strong>${aluno.nome}:</strong>`; // Removendo o CPF
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