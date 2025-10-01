document.addEventListener('DOMContentLoaded', () => {
    /**
     * Verifica se a string contém APENAS letras (incluindo acentos) e espaços.
     * @param {string} str - A string a ser verificada.
     * @returns {boolean} - Retorna true se for válida, false caso contrário.
     */
    function validarNome(str) {
        // Regex que permite A-Z, a-z, caracteres acentuados comuns em português e espaços (\s)
        const regexNome = /^[A-Za-záàâãéèêíìîóòôõúùûüçÇ\s]+$/;
        return regexNome.test(str);
    }

    const formCadastro = document.getElementById('formCadastro');
    const inputNome = document.getElementById('inputNome'); 

    if (!formCadastro) {
        console.error("Erro: O formulário de cadastro não foi encontrado!");
        return;
    }

    // Opcional (UX): Bloquear digitação de números no campo Nome em tempo real
    inputNome.addEventListener('keypress', (e) => {
        const charCode = (e.which) ? e.which : e.keyCode;

        if (charCode >= 48 && charCode <= 57) {
            e.preventDefault();
        }
    });

    formCadastro.addEventListener('submit', (evento) => {
        evento.preventDefault(); 
        
        const nome = inputNome.value.trim();
        const cpf = document.getElementById('inputCpf').value.trim();
        const senha = document.getElementById('inputSenha').value;

        // VALIDAÇÃO: Nome só pode ter letras
        if (!validarNome(nome)) {
            alert('O campo Nome só pode conter letras e espaços. Números e caracteres especiais não são permitidos.');
            inputNome.focus();
            return;
        }

        // Validação básica
        if (nome === "" || cpf === "" || senha === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const novoProfessor = {
            login: cpf,
            nome: nome,
            senha: senha,
            tipo: 'professor'
        };

        const professoresJSON = localStorage.getItem('professores');
        let professores = professoresJSON ? JSON.parse(professoresJSON) : [];

        // Verifica se o CPF já existe
        const cpfExiste = professores.some(prof => prof.login === novoProfessor.login);
        if (cpfExiste) {
            alert("Este CPF já está cadastrado como professor.");
            return;
        }

        professores.push(novoProfessor);
        localStorage.setItem('professores', JSON.stringify(professores));

        alert(`Cadastro de ${nome} (Professor) realizado com sucesso!`);
        
        formCadastro.reset();
        window.location.href = 'index.html';
    });
});