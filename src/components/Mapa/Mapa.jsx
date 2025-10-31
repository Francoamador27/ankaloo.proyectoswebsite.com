import React from 'react';
import useCont from '../../hooks/useCont';

const Mapa = () => {
      const {contact } = useCont();
    return (
            <iframe
                title="Ubicación Mint Odontología"
                src={contact.map_iframe ||  ""}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0"
            />
    );
}

export default Mapa;
