/*document.addEventListener('DOMContentLoaded', () => {
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
});*/
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

    /**
     * Valida se a string contém APENAS letras (maiúsculas/minúsculas) e espaços.
     * Permite acentos e a maioria dos caracteres comuns em nomes.
     * Retorna true se for VÁLIDO (não tem caracteres especiais não permitidos), false caso contrário.
     */
    function validarNome(nome) {
        // Regex: ^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$
        // [a-zA-Z] - letras de A a Z (maiúsculas e minúsculas)
        // [áàâã...ÇÑ] - letras acentuadas comuns em português e 'ñ'
        // \s - espaço em branco
        // + - um ou mais caracteres
        // ^ $ - início e fim da string (garante que SÓ tenha esses caracteres)
        const regex = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/;
        return regex.test(nome);
    }

    btnCadastro.addEventListener('click', () => {
        const nome = inputNome.value.trim();
        const cpf = inputCpf.value.trim();

        // 1. Validação Simples (campos vazios)
        if (nome === '' || cpf === '') {
            alert('Por favor, preencha o Nome e o CPF do aluno.');
            return;
        }

        // --- INÍCIO DA NOVA VALIDAÇÃO ---
        // 1.1. Validação de Caracteres Especiais no Nome
        if (!validarNome(nome)) {
            alert('Erro: O nome não pode conter caracteres especiais ou números. Por favor, utilize apenas letras e espaços.');
            inputNome.focus();
            return;
        }
        // --- FIM DA NOVA VALIDAÇÃO ---

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