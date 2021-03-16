# Feedback_360<sup>oTool

## 1. Apresentação

Este projeto é o desenvolvimento de um sistema web em SPA (Single Page Application) focado na user experience (experiência do usuário), voltado para uso de empresas que tenham equipes de desenvolvimento. O sistema irá coletar os dados preenchidos por seus usuários e, em cima destes, gerar uma linha histórica de acontecimentos. Isso permitirá que os administradores, tenham um acompanhamento sobre a evolução de cada profissional e da equipe como um todo.

`<CodeProject>`[Development of a Tool to Support the 360 Feedback Process in Workgroups Using Vue.js and Firebase DBaaS](https://www.codeproject.com/Articles/5272992/Development-of-a-Tool-to-Support-the-360-Feedback "Development of a Tool to Support the 360 Feedback Process in Workgroups Using Vue.js and Firebase DBaaS")

`<ResearchGate>`[Development of a Tool to Support the 360 Feedback Process in Workgroups Using Vue.js and Firebase DBaaS](https://www.researchgate.net/publication/342852151_Development_of_a_Tool_to_Support_the_360_Feedback_Process_in_Workgroups_Using_Vuejs_and_Firebase_DBaaS "Development of a Tool to Support the 360 Feedback Process in Workgroups Using Vue.js and Firebase DBaaS")

## 2. Especificação Funcional

Os usuários podem ser previamente cadastrados no sistema e indicados a qual equipe pertencem, podendo então realizar avaliações periódicas sobre os outros integrantes da equipe de forma anônima. O sistema gera relatórios aos líderes de equipe, onde é possível ver a evolução ou regressão dos membros da equipe, e quais os pontos fortes e a serem melhorados de cada um.

![](https://www.codeproject.com/KB/applications/5272992/use_case_diagram.jpg)

##### Lista de Usuários

	 1. Administrador
	 2. Líder de equipe
	 3. Membro colaborador

##### Principais Funcionalidades


- [x] Cadastrar-se
- [ ] Cadastro por integração com Github 
- [x] Consultar e editar perfil
- [x] Consultar rating pessoal
- [x] Consultar rating do time (squad)
- [x] Gerenciar sessões de avaliação
- [x] Gerenciar cadastro de usuários
- [x] Gerenciar time (squad)
- [x] Avaliar pares
- [ ] Receber menssagem de notificação 

##### Perfis de Acesso

| FUNCIONALIDADE | MEMBRO | LIDER | ADM |
| ------------ | ------------ | ------------ | ------------ |
| Cadastrar-se |  X |  X |   |
| Consultar e editar perfil | X |  X   | X |
| Consultar rating pessoal | X |   X  |    X |
| Consultar rating do time (squad) |  X |  X  |   X  |
| Gerenciar sessões de avaliação |   |   |   X  |
| Gerenciar cadastro de usuários |   |   |   X  |
| Gerenciar time (squad) |   | X |    |
| Avaliar pares |  X |  X |   |   |

##### Regras de Negócio

- **Aprovação**: Uma vez que o cadastro tenha sido feito pelo próprio usuário, o sistema irá avisar aos administradores a necessidade de aprovação dos perfis, bem como a alteração de acesso. Após todos os usuários serão livres para utilizar o sistema dentro de suas limitações.

- **Equipes**: Os administradores irão cadastrar as equipes, informando o nome, quem será o líder e seus respectivos membros;

- **Múltipas equipes**: os usuários podem participar de diversas equipes
simultaneamente, como líderes ou administradores, desde que elegíveis para isso.

- **Anonimato**: esta fase, sobre o funcionamento do sistema, foi definido que todos os resultados das avaliações serão anônimos com apontamento de índices e comentários se existirem, seja de algum membro específico ou sobre o grupo como um todo, afim de resguardar a segurança e a individualidade de cada participante.

- **Perfis de acesso**: serão três perfis para cadastro no sistema, sendo estes os perfis de usuário, líderes e administradores, cada um com seus níveis de acesso e responsabilidades sobre o sistema.

- **Cadastro**: os usuários são livres para fazer o próprio cadastro necessitando apenas informar o nome, telefone, e-mail e senha de preferência. Os demais dados pessoais podem ser preenchidos posteriormente ao primeiro acesso no sistema;

- **Dados adicionais**: os dados profissionais, de equipe, ou de projetodos membros são de reponsabilidade dos administradores;

- **Categorização**: para os resultados, foram levantados 4 perfis. O de transformador os colaboradores com alto potencial, o evolutivo rápido para aqueles com médio a alto potencial, o evolutivo lento para aqueles com potencial baixo a médio com restrições e o não evolutivo para aqueles que não se encaixarem dentro do esperado.

- **Deadline**: Ao final do prazo estipulado na criação da avaliação, ou quando todos os membros preencherem suas avaliações, o sistema liberará automaticamente o resultado, podendo ser acessada por todos os usuários participantes em sua home.

- **Abstenções**: na ocorrência de abstenções, o sistema ainda assim liberará o resultado. Para este caso, se a quantidade de membrosque responderam seja inferior a 5, o sistema considerará que as faltantes sejam “não sei responder”. Medidas como estas visam preservar a identidade de quem já respondeu evitando dados inconsistentes.

### 3. Projeto e Tecnologia Envolvida

Para o desenvolvimento do sistema a linguagem utilizada é o **JavaScript** com uso do **Framework Vue**, framework incremental em SPA (Single Page Application).

Para armazenamento dos dados será utilizado o **Firebase**, uma plataforma atualmente desenvolvida pela Google que provê diversos serviços para desenvolvimento de aplicações web e mobile, dos quais serão utilizados o banco de dados, o serviço de autenticação e as API’s (Application Programming Interface).

A figura 1 mostra os documentos e seus atributos definidos para o projeto. Vale ressaltar principalmente o conjunto de datos de configuração, composto por dados dinâmicos, tais como os "critérios de avaliação", "dados pessoais de um user" entre outros.

![]()
<img src="https://www.codeproject.com/KB/applications/5272992/tela_firebase_.png" width="500">
> Figura 1. Tela de gerenciamento do Firebase

As principais entidades que suportam o modelo do sistema desenvolvido são:

- **1. coleções para entidades de domínio**

	- **usuários (users)**: desenvolvedores de trabalho em equipe, avaliando e sendo avaliados

	- **avaliações (evaluations)**: sessão para avaliar alguém, é uma janela para observar, considerar e avaliar pelos pares

	- **elenco (squads)**: é uma tabela com todas as avaliações, contém pontos, critérios e observações feitas

- **2. coleções para relacionamentos** e

	- **avaliations_rates**: link usado para indicar a participação da pessoa em um processo de avaliação
squad_user**: link para associar uma pessoa a uma tabela de taxas de seleção

- **3. coleções para espelhamento**

	- **data_de_avaliação**: replica as informações para melhorar a carga de trabalho de apresentação de dados, o portfólio do usuário e da equipe

A figura 2 mostra o escopo de dependencia das entidades com uma abstração baseada em objetos e colaboração. 

<img src="https://i.ibb.co/q0JL539/asgoto-model-preview-1.png" alt="asgoto_model_preview_1" border="0" width="500">
> Figura 2. Modelo de entidades e suas colaborações.

A participação é enviada ao servidor de banco de dados por meio do Firebase Google API (Application Programming Interface). Esses dados serão salvos separadamente em diferentes coleções (**squads**) conectadas pelo ID dos membros avaliados e o ID da sessão de avaliação (**squad_user**). Portanto, a seguir, todas as outras classificações dos mesmos processos (**evaluations**) também são adicionadas.

Como ferrametnas e tecnologias de apoio ao processo de desenvolvimento temos:
- **Visual Studio**: editor de texto utilizado na geração da base de código da aplicação;
- **Firebase**: plataforma de desenvolvimento mobile e web pertencente a Google, com diversos serviços, dos quais serão utilizados as API’s e o banco de cados; 
- **Vue JS**: biblioteca JavaScript utilizada para construção de interfaces de usuário baseadas em componentes;
- **Bulma**: framework visual compatível com linguagens web;
- **Adobe Photoshop CC 2020**: editor de imagens;
- **Git**: sistema distribuído de controle de versão de software.
- **HTML, CSS e JavaScript**: para desenvolvimento e estilização dos componentes

### 4. Resultados

A figura 3 mostra a principal tela do sistema. Nela um membro de um determinado time avalia seus pares (outros integrantes do time) de acordo com os critérios definidos durante a criação da sessão de avaliação (assessement).

<img src="https://i.ibb.co/wR9pC3R/asgoto-tela-avaliando-1.png" alt="asgoto_tela_avaliando_1" border="0" width="500">
> Figura 3. Tela do processo de avaliação.

A figura 4 apresenta dois momentos par ao usuário administrador. Na primeira parte (topo) trata-se da tela de definiçao de uma sessão de avaliação (assessment). Nela o administrador define a identificação, as datas e as equipes que receberão esta sessão.

Na parte inferior, é apresentada a funcionalidade de construção de um time de trabalho. Trata-sede uma funcionalidade muito simples que ainda explora recursos de usabilidade para deixar a experiência do administrador mais agradável. Nesta tela o administrador define o nome do time, seu lider imediato e utilizando multiplas seleções inclui ou remove seus membros usuários.

![]()
<img src="https://www.codeproject.com/KB/applications/5272992/tela_admin.png" width="500">
> Figura 4. Tela do Administrador.

A figura 5 apresenta o relatório disponível para cada usuário. Ela tenta focar a atenção do usuário no contexto geral utilizando cores e um componente de fácil visualização estatística. Lembrand0 que as avaliações recebidas são anônimas.

![]()
<img src="https://www.codeproject.com/KB/applications/5272992/tela_relatorio_avaliacao_donut.png" width="500">
> Figura 5. Personal Rate Report Screen.

A figura 6 é a página de perfil do usuário. Além dos dados pessoais e a possibilidade de alterá-los o usuário também tem um indíce com sua pontuação geral no sistema, seguido do sua categoria.

![]()
<img src="https://www.codeproject.com/KB/applications/5272992/tela_home2.png" width="500">
> Figura 6. Personal Homepage from a Team Member.

### 5. Deploy

#### Para utilização do sistema:

1. Faça o clone deste projeto
2. Acesse a pasta web
3. Rode NPM INSTALL
4. Agora execute NPM RUN SERVE

Vale ressaltar que:

- Os cadastros devem ser feitos pela tela de registro
- Os usuários só terão acesso às avaliações se estiverem em uma equipe
- Ainda não foi implementado nenhuma tratativa para usuário desabilitado
- O acesso a base de dados firebase ainda é privado, envie um e-mail para o e-mail andreseijigoto@gmail.com para que seu e-mail seja incluído na lista editável

#### Project setup

	$ npm install

**Compiles and hot-reloads for development**

	$ npm run serve

**Compiles and minifies for production**

	$ npm run build

**Lints and fixes files**

	$ npm run lint


More and customize configuration: See [Configuration Reference](https://cli.vuejs.org/config/).


### Referências

1. IBC Coaching (2020). Site oficial do Instituto Brasileiro de Coaching [on-line]. Disponível em “https://www.ibccoaching.com.br/”. Acessado em 13 de março de 2020.
2. Menvie (2020). Plataforma e informativo sobre avaliação 360 [on-line]. Disponível em “https://menvie.com.br”. Acessado em 13 de março de 2020.
3. Impulse UP (2020). Plataforma e informativo sobre avaliação 360 [on-line]. Disponível em “https://www.impulseup.com”. Acessado em 13 de março de 2020.
4. Ship Competency (2020). Plataforma e informativo sobre avaliação 360 [on-line].
5. Disponível em “https://www.shipcompetency.com/”. Acessado em 13 de março de 2020.


MIT License Copyright 2020 &reg; _asgoto201 

and (CC) Creative Commons CC BY-NC_ 
andreseijigoto@gmail.com