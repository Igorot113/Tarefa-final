document.addEventListener('DOMContentLoaded', () => {
    const btnCadastro = document.getElementById('btnCadastroAluno');
    const inputNome = document.getElementById('nome');
    const inputCpf = document.getElementById('cpf');

    // Funções de ajuda
    function getAlunos() {
        return JSON.parse(localStorage.getItem('alunos')) || [];
    }

    function saveAlunos(alunos) {
        localStorage.setItem('alunos', JSON.stringify(alunos));
    }

    btnCadastro.addEventListener('click', () => {
        const nome = inputNome.value.trim();
        const cpf = inputCpf.value.trim();

        // 1. Validação Simples
        if (nome === '' || cpf === '') {
            alert('Por favor, preencha o Nome e o CPF do aluno.');
            return;
        }

        let alunos = getAlunos();

        // 2. Verifica duplicidade de CPF
        const cpfExistente = alunos.some(aluno => aluno.cpf === cpf);
        if (cpfExistente) {
            alert('Erro: Já existe um aluno cadastrado com este CPF.');
            inputCpf.focus();
            return;
        }
        
        // 3. Cria o objeto do novo aluno
        const novoAluno = {
            nome: nome,
            cpf: cpf,
            // OBS: Não estamos adicionando senha aqui. O aluno precisará de um processo 
            // de "primeiro acesso" para definir a senha se o login exigir.
            tipo: 'aluno', 
            statusAprovacao: 'Pendente',
            aulasAtribuidas: {}, // Objeto vazio
            tarefasPendentes: [] // Array vazio
        };

        // 4. Salva no LocalStorage
        alunos.push(novoAluno);
        saveAlunos(alunos);

        alert(`Aluno ${nome} cadastrado com sucesso!`);
        
        // Opcional: Limpar formulário
        inputNome.value = '';
        inputCpf.value = '';

        // Opcional: Redirecionar de volta para a tela inicial do professor
        // window.location.href = 'telaInicialProfessor.html';
    });
});