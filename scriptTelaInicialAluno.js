document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis DOM ---
    const alunoNomeDisplay = document.getElementById('alunoNomeDisplay');
    const listaTarefasUL = document.getElementById('listaTarefasAlunoUL');
    const listaAulasUL = document.getElementById('listaAulasAlunoUL');
    const statusAprovacaoDisplay = document.getElementById('statusAprovacaoDisplay');
    const btnLogout = document.getElementById('btnLogoutAluno');
    
    // Funções de ajuda para LocalStorage
    function getAlunos() {
        return JSON.parse(localStorage.getItem('alunos')) || [];
    }
    
    // --------------------------------------------------------------------------------
    // --- 1. VERIFICAÇÃO DE SESSÃO E CARREGAMENTO DO ALUNO LOGADO ---
    // --------------------------------------------------------------------------------

    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    let alunoLogado = null;

    if (!usuarioLogadoJSON) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        window.location.href = 'login.html';
        return;
    }

    const dadosSessao = JSON.parse(usuarioLogadoJSON);

    // Garante que é um aluno e carrega o objeto completo do localStorage
    if (dadosSessao.tipo === 'aluno') {
        const alunos = getAlunos();
        
        // CORREÇÃO CRUCIAL AQUI: 
        // 1. Usamos o identificador de login (dadosSessao.cpf ou dadosSessao.cpfHash)
        // 2. Comparamos com o campo SALVO no localStorage, que é 'cpfHash'.
        // Assumindo que o login SALVA o hash no campo 'cpf' da sessão para simplicidade,
        // mas compara com o campo 'cpfHash' no localStorage.
        
        const cpfIdentificador = dadosSessao.cpfHash || dadosSessao.cpf; // Pega o hash da sessão
        
        alunoLogado = alunos.find(a => a.cpfHash === cpfIdentificador); // BUSCA PELO cpfHash SALVO!
    }

    if (!alunoLogado) {
        alert("Conta não encontrada ou tipo incorreto. Redirecionando para login.");
        sessionStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
        return;
    }

    // --------------------------------------------------------------------------------
    // --- 2. INJEÇÃO DE DADOS NA TELA (O RESTO ESTAVA PERFEITO) ---
    // --------------------------------------------------------------------------------
    
    // A. Nome do Aluno
    alunoNomeDisplay.textContent = alunoLogado.nome;
    
    // B. Status de Aprovação
    statusAprovacaoDisplay.textContent = alunoLogado.statusAprovacao || 'Pendente';
    statusAprovacaoDisplay.classList.add(alunoLogado.statusAprovacao.toLowerCase());


    // C. Tarefas Pendentes
    function carregarTarefas() {
        listaTarefasUL.innerHTML = '';
        // O RESTANTE É PERFEITO, POIS USA SOMENTE AS PROPRIEDADES DO alunoLogado
        const tarefas = alunoLogado.tarefasPendentes || []; 
        // ... (restante da função carregarTarefas)
        
        if (tarefas.length === 0) {
            listaTarefasUL.innerHTML = '<li>Nenhuma tarefa pendente. Bom trabalho!</li>';
            return;
        }

        tarefas.forEach(tarefa => {
            const li = document.createElement('li');
            li.textContent = tarefa;
            listaTarefasUL.appendChild(li);
        });
    }

    // D. Aulas Atribuídas
    function carregarAulas() {
        listaAulasUL.innerHTML = '';
        // O RESTANTE É PERFEITO, POIS USA SOMENTE AS PROPRIEDADES DO alunoLogado
        const aulas = alunoLogado.aulasAtribuidas || {};
        const diasSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];

        let aulasEncontradas = false;

        diasSemana.forEach(dia => {
            const materia = aulas[dia];
            
            const li = document.createElement('li');
            const spanDia = document.createElement('span');
            const spanAula = document.createElement('span');

            spanDia.className = 'diaSemana';
            spanAula.className = 'nomeAula';

            spanDia.textContent = dia + ": ";
            spanAula.textContent = materia || "Nenhuma aula atribuída";
            
            li.appendChild(spanDia);
            li.appendChild(spanAula);
            listaAulasUL.appendChild(li);
            
            if (materia) {
                aulasEncontradas = true;
            }
        });
    }
    
    // --------------------------------------------------------------------------------
    // --- 3. EVENTOS FINAIS (Mantidos) ---
    // --------------------------------------------------------------------------------
    
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('usuarioLogado');
        alert('Sessão encerrada. Até logo!');
        window.location.href = 'login.html';
    });

    // Inicia o carregamento dos dados
    carregarTarefas();
    carregarAulas();
});