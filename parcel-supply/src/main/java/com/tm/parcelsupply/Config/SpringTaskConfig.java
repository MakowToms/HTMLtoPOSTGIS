package com.tm.parcelsupply.Config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;


@Configuration
@EnableScheduling
@ComponentScan({ "com.tm.parcelsupply.Service" })
public class SpringTaskConfig {
}
