export const Environment = {
    /**
     * Define a quantidade de linhas a ser carregada por padrão nas listagens
     */
    LIMITE_DE_LINHAS: 5,
    /**
     * Placeholder exibido nas inputs
     */
    INPUT_DE_BUSCA: 'Pesquisar...',
    /**
     * Texto exibido quando nenhum registro é encontrado em uma listagem
     */
    LISTAGEM_VAZIA: 'Nenhum registro encontrado.',
    /**
     * Url base de consulta dos dados dessa aplicação
     */
    URL_BASE: 'http://192.168.0.13:8989'
    //Usando mock: http://localhost:3333 -> APP_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLWFwaSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzM4OTM2NDQxfQ.mbz2MKf0sS2-11EIZmftyYkx_PJeWzu_u21h4Kesn-k"
    //Usando SpringBoot: http://192.168.14.198:8000
    //testando auth: http://localhost:8989
};