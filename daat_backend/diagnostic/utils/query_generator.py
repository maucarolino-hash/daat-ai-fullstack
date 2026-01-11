class SearchQueryGenerator:
    """
    Gera queries otimizadas de pesquisa baseadas nos dados da startup
    """
    
    @staticmethod
    def generate_competitor_queries(startup_data):
        """
        Gera queries para encontrar concorrentes
        """
        sector = startup_data.get('sector', '').strip()
        solution_type = startup_data.get('solution_type', '').strip()
        target_audience = startup_data.get('target_audience', '').strip()
        
        queries = []
        
        # Query 1: Concorrentes diretos por solução
        if solution_type:
            queries.append(f"{solution_type} competitors Brazil 2024")
            queries.append(f"{solution_type} similar companies startups")
        
        # Query 2: Concorrentes por setor + target
        if sector and target_audience:
            queries.append(f"{sector} {target_audience} solutions companies")
        
        # Query 3: Empresas com funding neste espaço
        if sector:
            queries.append(f"{sector} startups funding 2024 Crunchbase")
            queries.append(f"top {sector} companies Brazil market share") # ADDED: Leaders
        
        # Query 4: Alternativas de mercado
        if solution_type:
            queries.append(f"alternatives to {solution_type}")
            queries.append(f"biggest players in {sector} Brazil") # ADDED: Giants
        
        return queries[:6]  # Increased limit to capture giants
    
    @staticmethod
    def generate_market_size_queries(startup_data):
        """
        Gera queries para dados de tamanho de mercado
        """
        sector = startup_data.get('sector', '').strip()
        geography = startup_data.get('geography', 'Brazil').strip()
        
        queries = []
        
        if sector:
            queries.append(f"{sector} market size {geography} 2024")
            queries.append(f"{sector} TAM SAM SOM {geography}")
            queries.append(f"{sector} industry statistics {geography}")
        
        return queries
    
    @staticmethod
    def generate_trend_queries(startup_data):
        """
        Gera queries para identificar tendências
        """
        sector = startup_data.get('sector', '').strip()
        
        queries = []
        
        if sector:
            queries.append(f"{sector} trends 2024 2025")
            queries.append(f"{sector} growth forecast")
            queries.append(f"{sector} innovation emerging technologies")
        
        return queries
    
    @staticmethod
    def generate_all_queries(startup_data):
        """
        Gera todas as queries necessárias
        """
        return {
            'competitors': SearchQueryGenerator.generate_competitor_queries(startup_data),
            'market_size': SearchQueryGenerator.generate_market_size_queries(startup_data),
            'trends': SearchQueryGenerator.generate_trend_queries(startup_data)
        }

    @staticmethod
    def generate_deep_dive_queries(competitor_name, sector):
        """
        Gera queries específicas para investigar um concorrente a fundo
        """
        queries = [
            f"{competitor_name} revenue 2024",
            f"{competitor_name} market share {sector}",
            f"{competitor_name} customer reviews weaknesses complaints",
            f"{competitor_name} vs competitors features"
        ]
        return queries
