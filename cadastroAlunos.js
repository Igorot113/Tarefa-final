document.addEventListener('DOMContentLoaded', () => {
    const btnCadastroAluno = document.getElementById('btnCadastroAluno');
    const inputNome = document.getElementById('nome');

    /**
     * Verifica se a string contém APENAS letras (incluindo acentos) e espaços.
     */
    function validarNome(str) {
        // Regex que permite A-Z, a-z, caracteres acentuados comuns em português e espaços (\s)
        const regexNome = /^[A-Za-záàâãéèêíìîóòôõúùûüçÇ\s]+$/;
        return regexNome.test(str);
    }
    
    /**
     * Verifica se a senha é forte:
     * - Mínimo de 8 caracteres
     * - Contém pelo menos 1 caractere especial (!@#$%^&*(),.?)
     */
    function validarSenhaForte(senha) {
        // Regex para verificar se contém pelo menos 1 caractere especial
        const regexEspecial = /[!@#$%^&*(),.?":{}|<>]/;
        
        if (senha.length < 8) {
            return false;
        }
        
        if (!regexEspecial.test(senha)) {
            return false;
        }

        return true;
    }

    // UX: Bloquear digitação de números no campo Nome em tempo real
    if (inputNome) {
        inputNome.addEventListener('keypress', (e) => {
            const charCode = (e.which) ? e.which : e.keyCode;
            if (charCode >= 48 && charCode <= 57) {
                e.preventDefault();
            }
        });
    }

    btnCadastroAluno.addEventListener('click', () => {
        const nome = document.getElementById('nome').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const senha = document.getElementById('senha').value;

        // VALIDAÇÃO DE NOME (Letras e espaços)
        if (!validarNome(nome)) {
            alert('O campo Nome só pode conter letras e espaços. Números e caracteres especiais não são permitidos.');
            document.getElementById('nome').focus(); 
            return; 
        }

        // VALIDAÇÃO DE SENHA FORTE (8 caracteres e 1 especial)
        if (!validarSenhaForte(senha)) {
            alert("A senha é fraca. Ela deve conter pelo menos 8 caracteres e incluir no mínimo 1 caractere especial (ex: !@#$%&*).");
            document.getElementById('senha').focus();
            return; 
        }

        // VALIDAÇÃO BÁSICA DE CAMPOS VAZIOS
        if (!nome || !cpf || !senha) {
            alert('Por favor, preencha todos os campos para cadastrar o aluno.');
            return; 
        }

        // CHECAGEM DE CPF DUPLICADO
        const alunosExistentesJSON = localStorage.getItem('alunosCadastrados');
        let alunosExistentes = alunosExistentesJSON ? JSON.parse(alunosExistentesJSON) : [];
        
        // Verifica se o CPF já está cadastrado
        const cpfDuplicado = alunosExistentes.some(aluno => aluno.cpf === cpf);
        if (cpfDuplicado) {
            alert('Erro: Já existe um aluno cadastrado com este CPF.');
            return;
        }

        const novoAluno = {
            nome: nome,
            cpf: cpf,
            senha: senha 
        };
        
        alunosExistentes.push(novoAluno);
        localStorage.setItem('alunosCadastrados', JSON.stringify(alunosExistentes));
        alert(`Aluno(a) ${nome} cadastrado(a) com sucesso!`);
        document.getElementById('nome').value = '';
        document.getElementById('cpf').value = '';
        document.getElementById('senha').value = '';
        
        console.log('Lista de alunos atualizada:', alunosExistentes);
    });
});