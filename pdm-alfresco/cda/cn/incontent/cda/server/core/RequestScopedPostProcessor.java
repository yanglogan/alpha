package cn.incontent.cda.server.core;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;

public class RequestScopedPostProcessor implements BeanFactoryPostProcessor {

	public void postProcessBeanFactory(ConfigurableListableBeanFactory factory)
			throws BeansException {
		for (String beanName : factory.getBeanDefinitionNames()) {
			BeanDefinition beanDefinition = factory.getBeanDefinition(beanName);

			beanDefinition.setScope("prototype");
		}
		
	}
}
