export const seoServicePageId = 'supplier-search' as const;

export type SeoServiceLocale = 'es' | 'pt';

type ContentBlock = {
  eyebrow: string;
  title: string;
  paragraphs?: readonly string[];
  intro?: string;
  items?: readonly { title: string; text: string }[];
  list?: readonly string[];
};

export type SeoServicePageContent = {
  id: typeof seoServicePageId;
  locale: SeoServiceLocale;
  htmlLang: 'es-AR' | 'pt-BR';
  openGraphLocale: 'es_AR' | 'pt_BR';
  slug: string;
  seo: {
    title: string;
    description: string;
    imageAlt: string;
  };
  hero: ContentBlock;
  sections: readonly ContentBlock[];
  comparison: ContentBlock;
  result: ContentBlock;
  role: ContentBlock;
  useCases: ContentBlock;
  related: ContentBlock & { label: string };
  faq: {
    eyebrow: string;
    title: string;
    items: readonly { question: string; answer: string }[];
  };
  cta: ContentBlock & { button: string };
};

const pages = {
  es: {
    id: seoServicePageId,
    locale: 'es',
    htmlLang: 'es-AR',
    openGraphLocale: 'es_AR',
    slug: 'busqueda-proveedores-china',
    seo: {
      title: 'Búsqueda de proveedores en China para empresas | Vértice Sino',
      description: 'Ayudamos a empresas de Argentina y América Latina a buscar, organizar y comparar proveedores y fabricantes en China según producto, volumen, requisitos técnicos y objetivos del proyecto.',
      imageAlt: 'Vértice Sino — búsqueda y selección de proveedores en China para empresas de Argentina y América Latina',
    },
    hero: {
      eyebrow: 'Proveedores en China',
      title: 'Búsqueda y selección de proveedores en China',
      paragraphs: [
        'Encontrar nombres de empresas en China es relativamente sencillo. El trabajo más importante comienza después: determinar qué proveedores realmente responden a las necesidades del proyecto y qué información conviene comparar antes de avanzar.',
        'Vértice Sino investiga el mercado chino a partir de una necesidad empresarial concreta y organiza las alternativas encontradas para facilitar una evaluación más clara.',
      ],
    },
    sections: [
      {
        eyebrow: 'El punto de partida',
        title: 'Antes de buscar proveedores, hay que entender qué necesita realmente la empresa',
        paragraphs: [
          'Una búsqueda útil no empieza con una lista de fábricas. Empieza por definir el proyecto.',
          'El producto, su aplicación, el volumen estimado, los requisitos técnicos, el nivel de personalización, el presupuesto, los plazos y el objetivo comercial pueden cambiar por completo el tipo de proveedor que conviene considerar.',
          'Por eso, antes de iniciar la investigación, organizamos los principales criterios de la necesidad. Esto permite orientar mejor la búsqueda y evitar largas listas de empresas que tienen poca relación con el proyecto.',
        ],
      },
      {
        eyebrow: 'Investigación en China',
        title: 'Encontrar nombres es solo una parte del trabajo',
        paragraphs: [
          'El mercado chino reúne fabricantes, empresas comerciales, integradores, proveedores especializados y compañías con distintos niveles de experiencia internacional.',
          'Durante la investigación buscamos alternativas relacionadas con las características reales del proyecto y reunimos la información disponible para entender qué empresas merecen un análisis más profundo.',
          'El objetivo no es presentar la mayor cantidad posible de proveedores. Es construir una selección que pueda analizarse con criterios claros.',
        ],
      },
    ],
    comparison: {
      eyebrow: 'Información para comparar',
      title: 'Una cotización aislada rara vez cuenta toda la historia',
      intro: 'Según las características del proyecto, podemos organizar información como:',
      items: [
        { title: 'Perfil de la empresa', text: 'Información empresarial disponible, actividad principal y relación con el producto o solución investigada.' },
        { title: 'Producto y especificaciones', text: 'Modelos, configuraciones, requisitos técnicos y posibilidades de personalización relevantes para el proyecto.' },
        { title: 'Cantidad mínima', text: 'MOQ (cantidad mínima de pedido) y otras condiciones comerciales que pueden influir en la viabilidad de la compra.' },
        { title: 'Precio y condiciones', text: 'Cotizaciones recibidas, vigencia de la oferta, condiciones de pago y otros elementos comerciales informados por el proveedor.' },
        { title: 'Plazos', text: 'Tiempos de producción o suministro informados y otras condiciones relacionadas con el cronograma.' },
        { title: 'Documentación', text: 'Certificaciones, fichas técnicas u otros documentos cuando sean relevantes y estén disponibles para su análisis.' },
      ],
    },
    result: {
      eyebrow: 'Qué recibe el cliente',
      title: 'Alternativas organizadas para facilitar una decisión empresarial',
      paragraphs: [
        'El resultado de una búsqueda no debería ser simplemente una colección de enlaces o contactos.',
        'Organizamos las alternativas y la información relevante para que el cliente pueda entender mejor las diferencias entre los proveedores, identificar qué puntos todavía necesitan aclaración y decidir con qué empresas tiene sentido avanzar.',
        'La decisión comercial permanece siempre en manos del cliente.',
      ],
    },
    role: {
      eyebrow: 'Nuestro papel',
      title: 'Investigación, organización de información y comunicación con China',
      paragraphs: [
        'Vértice Sino actúa como consultora y facilitadora entre la necesidad del cliente y el mercado proveedor chino.',
        'Podemos apoyar la búsqueda de proveedores, la organización y comparación de la información disponible y la comunicación necesaria para aclarar aspectos comerciales o técnicos del proyecto.',
        'No actuamos como importador, no recibimos pagos destinados a la compra de mercadería y no sustituimos a los profesionales responsables de logística, despacho aduanero, certificaciones obligatorias ni decisiones legales o fiscales.',
      ],
    },
    useCases: {
      eyebrow: 'Cuándo puede ser útil este servicio',
      title: 'Para empresas que necesitan entender mejor las alternativas disponibles en China',
      intro: 'Este servicio puede ser adecuado cuando la empresa:',
      list: [
        'todavía no tiene proveedores identificados en China;',
        'encontró varias opciones, pero necesita organizar mejor la investigación;',
        'busca fabricantes para un producto o proyecto específico;',
        'necesita comparar alternativas antes de iniciar una negociación más avanzada;',
        'está evaluando equipos, componentes, productos o soluciones de fabricación china.',
      ],
    },
    related: {
      eyebrow: 'Siguiente etapa',
      title: '¿Ya tiene proveedores y necesita compararlos?',
      paragraphs: ['Cuando ya existen empresas candidatas, la siguiente necesidad puede ser organizar y contrastar información comercial, técnica y empresarial antes de decidir con qué proveedores avanzar.'],
      label: 'Evaluación y comparación de proveedores',
    },
    faq: {
      eyebrow: '',
      title: 'FAQ',
      items: [
        { question: '¿Vértice Sino compra productos en nombre del cliente?', answer: 'No. El cliente mantiene la relación comercial y financiera directamente con el proveedor elegido. Vértice Sino presta servicios de investigación, organización de información, comparación y apoyo en la comunicación.' },
        { question: '¿Trabajan solamente con productos terminados?', answer: 'No necesariamente. La búsqueda puede incluir productos, componentes, equipos industriales, soluciones de fabricación y proyectos con requisitos específicos, según la necesidad de cada empresa.' },
        { question: '¿La búsqueda garantiza que un proveedor no tendrá problemas?', answer: 'No. Ninguna investigación elimina por completo los riesgos de una relación comercial. Nuestro trabajo busca mejorar la calidad de la información disponible y hacer más estructurada la comparación de alternativas antes de la decisión del cliente.' },
        { question: '¿Vértice Sino se ocupa de la importación?', answer: 'No actuamos como importador ni realizamos el despacho aduanero en nombre del cliente. Nuestro trabajo se concentra en la investigación y análisis de proveedores, la organización de información y la comunicación relacionada con el proyecto en China.' },
      ],
    },
    cta: {
      eyebrow: 'Su proyecto',
      title: '¿Qué necesita encontrar su empresa en China?',
      paragraphs: ['Cuéntenos qué producto, equipo, componente o solución está buscando. A partir de esa información podemos evaluar el alcance necesario para iniciar la investigación.'],
      button: 'Contarnos sobre el proyecto',
    },
  },
  pt: {
    id: seoServicePageId,
    locale: 'pt',
    htmlLang: 'pt-BR',
    openGraphLocale: 'pt_BR',
    slug: 'busca-fornecedores-china',
    seo: {
      title: 'Busca de fornecedores na China para empresas | Vértice Sino',
      description: 'Ajudamos empresas do Brasil a buscar, organizar e comparar fornecedores e fabricantes na China de acordo com produto, volume, requisitos técnicos e objetivos do projeto.',
      imageAlt: 'Vértice Sino — busca e seleção de fornecedores na China para empresas brasileiras',
    },
    hero: {
      eyebrow: 'Fornecedores na China',
      title: 'Busca e seleção de fornecedores na China',
      paragraphs: [
        'Encontrar empresas na China é relativamente simples. O trabalho mais importante começa depois: entender quais fornecedores realmente correspondem às necessidades do projeto e quais informações precisam ser comparadas antes de avançar.',
        'A Vértice Sino pesquisa o mercado chinês a partir de uma necessidade empresarial concreta e organiza as alternativas encontradas para facilitar uma avaliação mais clara.',
      ],
    },
    sections: [
      {
        eyebrow: 'O ponto de partida',
        title: 'Antes de buscar fornecedores, é preciso entender o que a empresa realmente precisa',
        paragraphs: [
          'Uma busca eficiente não começa com uma lista de fábricas. Começa pela definição do projeto.',
          'Produto, aplicação, quantidade estimada, requisitos técnicos, nível de personalização, orçamento, prazo e objetivo comercial podem mudar completamente o perfil de fornecedor que faz sentido considerar.',
          'Por isso, antes de iniciar a pesquisa, organizamos os principais critérios da demanda. Isso permite direcionar a busca e evitar listas extensas de empresas que pouco têm a ver com o projeto.',
        ],
      },
      {
        eyebrow: 'Pesquisa na China',
        title: 'Buscar nomes é apenas a primeira parte do trabalho',
        paragraphs: [
          'O mercado chinês reúne fabricantes, empresas comerciais, integradores, fornecedores especializados e empresas com diferentes níveis de experiência internacional.',
          'Durante a pesquisa, buscamos alternativas relacionadas às características reais do projeto e reunimos as informações disponíveis para entender quais empresas merecem uma análise mais detalhada.',
          'O objetivo não é apresentar o maior número possível de fornecedores. É construir uma seleção que possa ser analisada com critérios claros.',
        ],
      },
    ],
    comparison: {
      eyebrow: 'Informações para comparar',
      title: 'Uma cotação isolada raramente conta toda a história',
      intro: 'Dependendo do projeto, organizamos informações como:',
      items: [
        { title: 'Perfil da empresa', text: 'Informações empresariais disponíveis, atividade principal e relação com o produto ou solução pesquisada.' },
        { title: 'Produto e especificações', text: 'Modelos, configurações, requisitos técnicos e possibilidades de personalização relevantes para o projeto.' },
        { title: 'Quantidade mínima', text: 'MOQ (quantidade mínima de pedido) e outras condições comerciais que podem influenciar a viabilidade da compra.' },
        { title: 'Preço e condições', text: 'Cotações recebidas, validade da proposta, condições de pagamento e demais elementos comerciais informados pelo fornecedor.' },
        { title: 'Prazo', text: 'Tempo de produção ou fornecimento informado e outras condições relacionadas ao cronograma.' },
        { title: 'Documentação', text: 'Certificações, fichas técnicas ou outros documentos quando forem relevantes e estiverem disponíveis para análise.' },
      ],
    },
    result: {
      eyebrow: 'O que o cliente recebe',
      title: 'Alternativas organizadas para facilitar uma decisão empresarial',
      paragraphs: [
        'O resultado da pesquisa não deve ser apenas uma coleção de links ou contatos.',
        'Organizamos as alternativas e as informações relevantes para que o cliente possa entender melhor as diferenças entre os fornecedores, identificar pontos que ainda precisam ser esclarecidos e decidir quais empresas fazem sentido para a próxima etapa.',
        'A decisão comercial permanece sempre com o cliente.',
      ],
    },
    role: {
      eyebrow: 'Nosso papel',
      title: 'Pesquisa, organização de informações e comunicação com a China',
      paragraphs: [
        'A Vértice Sino atua como consultoria e facilitadora entre a necessidade do cliente e o mercado fornecedor chinês.',
        'Podemos apoiar a pesquisa de fornecedores, a organização e comparação das informações disponíveis e a comunicação necessária para esclarecer aspectos comerciais ou técnicos do projeto.',
        'Não atuamos como importadora, não recebemos pagamentos destinados à compra de mercadorias e não substituímos os profissionais responsáveis por logística, desembaraço aduaneiro, certificações obrigatórias ou decisões jurídicas e fiscais.',
      ],
    },
    useCases: {
      eyebrow: 'Quando este serviço faz sentido',
      title: 'Para empresas que precisam entender melhor as alternativas disponíveis na China',
      intro: 'Este serviço pode ser adequado quando a empresa:',
      list: [
        'ainda não possui fornecedores identificados na China;',
        'encontrou várias opções, mas precisa organizar melhor a pesquisa;',
        'busca fabricantes para um produto ou projeto específico;',
        'precisa comparar alternativas antes de iniciar uma negociação mais avançada;',
        'está avaliando equipamentos, componentes, produtos ou soluções de fabricação chinesa.',
      ],
    },
    related: {
      eyebrow: 'Próxima etapa',
      title: 'Já possui fornecedores e precisa compará-los?',
      paragraphs: ['Quando já existem empresas candidatas, a próxima necessidade pode ser organizar e contrastar informações comerciais, técnicas e empresariais antes de decidir com quais fornecedores avançar.'],
      label: 'Avaliação e comparação de fornecedores',
    },
    faq: {
      eyebrow: '',
      title: 'FAQ',
      items: [
        { question: 'A Vértice Sino compra produtos em nome do cliente?', answer: 'Não. O cliente mantém a relação comercial e financeira diretamente com o fornecedor escolhido. A Vértice Sino presta serviços de pesquisa, organização de informações, comparação e apoio à comunicação.' },
        { question: 'Vocês trabalham apenas com produtos prontos?', answer: 'Não necessariamente. A pesquisa pode envolver produtos, componentes, equipamentos industriais, soluções de fabricação e projetos com requisitos específicos, dependendo da necessidade apresentada pela empresa.' },
        { question: 'A busca garante que um fornecedor não apresentará problemas?', answer: 'Não. Nenhuma pesquisa elimina completamente os riscos de uma relação comercial. Nosso trabalho busca melhorar a qualidade das informações disponíveis e tornar a comparação entre alternativas mais estruturada antes da decisão do cliente.' },
        { question: 'A Vértice Sino cuida da importação para o Brasil?', answer: 'Não atuamos como importadora nem realizamos o desembaraço aduaneiro em nome do cliente. Nosso foco está na pesquisa e análise de fornecedores, na organização das informações e na comunicação relacionada ao projeto na China.' },
      ],
    },
    cta: {
      eyebrow: 'Seu projeto',
      title: 'O que sua empresa precisa encontrar na China?',
      paragraphs: ['Conte-nos qual produto, equipamento, componente ou solução sua empresa está buscando. A partir dessas informações, podemos avaliar o escopo necessário para iniciar a pesquisa.'],
      button: 'Falar sobre o projeto',
    },
  },
} as const satisfies Record<SeoServiceLocale, SeoServicePageContent>;

export const seoServiceStaticParams = Object.values(pages).map(({ locale, slug }) => ({
  locale,
  serviceSlug: slug,
}));

export function getSeoServicePage(locale: string, serviceSlug: string): SeoServicePageContent | undefined {
  if (locale !== 'es' && locale !== 'pt') return undefined;
  const page = pages[locale];
  return page.slug === serviceSlug ? page : undefined;
}

export function getSeoServiceLanguageUrls() {
  return {
    es: `/es/${pages.es.slug}`,
    'pt-BR': `/pt/${pages.pt.slug}`,
  } as const;
}
