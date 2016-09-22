# Build the Base for Symphony/Silex web apps

FROM ubuntu

# Properties
VOLUME ["/var/www/html"]
EXPOSE 443/tcp
EXPOSE 80/tcp

# Setup Apache & PHP
RUN apt-get update && apt-get -y install apache2 php-mysql php libapache2-mod-php \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY files/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY files/startup.sh /var/opt/startup.sh

RUN /usr/sbin/a2dismod 'mpm_*' && /usr/sbin/a2enmod mpm_prefork \
    && /usr/sbin/a2ensite default-ssl \
    && /usr/sbin/a2enmod ssl \
    && a2enmod rewrite \
    && a2enmod socache_shmcb \
    && echo ServerName localhost  >> /etc/apache2/apache2.conf \
    && chmod +x /var/opt/startup.sh

# Runtime command
CMD ["/var/opt/startup.sh"]
