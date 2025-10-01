document.addEventListener('DOMContentLoaded', () => {
    const btnCadastroAluno = document.getElementById('btnCadastroAluno');
    const inputNome = document.getElementById('nome');
    /**
     * //Verifica se a string contém APENAS letras (incluindo acentos) e espaços.
     * @param {string} str - A string a ser verificada.
     * @returns {boolean} - Retorna true se for válida, false caso contrário.
     */
    function validarNome(str) {
        // Regex que permite A-Z, a-z, caracteres acentuados comuns em português e espaços (\s)
        const regexNome = /^[A-Za-záàâãéèêíìîóòôõúùûüçÇ\s]+$/;
        return regexNome.test(str);
    }
    
    // Listener para impedir que números sejam digitados no campo Nome
    inputNome.addEventListener('keypress', (e) => {
        const charCode = (e.which) ? e.which : e.keyCode;
        
        // Bloqueia códigos de tecla que representam dígitos (0-9)
        if (charCode >= 48 && charCode <= 57) {
            e.preventDefault();
        }
    });

    btnCadastroAluno.addEventListener('click', () => {
        // Pega os valores dos campos de entrada (inputs) e remove espaços extras
        const nome = inputNome.value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const senha = document.getElementById('senha').value;

        // Validação de Campos Vazios
        if (!nome || !cpf || !senha) {
            alert('Por favor, preencha todos os campos para cadastrar o aluno.');
            return; // Interrompe a função
        }

        // Validação de Caracteres Especiais e Números no Nome
        if (!validarNome(nome)) {
            alert('O campo Nome só pode conter letras e espaços. Números e caracteres especiais não são permitidos.');
            inputNome.focus(); 
            return; // Interrompe o cadastro
        }

        const novoAluno = {
            nome: nome,
            cpf: cpf,
            senha: senha
        };

        const alunosExistentesJSON = localStorage.getItem('alunosCadastrados');
        const alunosExistentes = alunosExistentesJSON ? JSON.parse(alunosExistentesJSON) : [];
        
        // Opcional: Verifica se o CPF já está cadastrado
        const cpfDuplicado = alunosExistentes.some(aluno => aluno.cpf === cpf);
        if (cpfDuplicado) {
            alert('Erro: Já existe um aluno cadastrado com este CPF.');
            return;
        }

        alunosExistentes.push(novoAluno);
        localStorage.setItem('alunosCadastrados', JSON.stringify(alunosExistentes));

        alert(`Aluno(a) ${nome} cadastrado(a) com sucesso!`);

        // Limpa os campos após o cadastro
        inputNome.value = '';
        document.getElementById('cpf').value = '';
        document.getElementById('senha').value = '';

        console.log('Lista de alunos atualizada:', alunosExistentes);
    });
});