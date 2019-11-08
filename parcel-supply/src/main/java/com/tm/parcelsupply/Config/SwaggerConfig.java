package com.tm.parcelsupply.Config;

import com.google.common.collect.Lists;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
@Profile({"!test"})
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2).globalOperationParameters(Lists.newArrayList(
                new ParameterBuilder().name("Authorization")
                        .parameterType("header")
                        .description("Authorization header")
                        .modelRef(new ModelRef("string"))
                        .build()
        )).select()
                .apis(RequestHandlerSelectors.basePackage("com.tm.parcelsupply"))
                .paths(PathSelectors.any())
                .build();
    }
}
