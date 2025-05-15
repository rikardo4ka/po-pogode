import React, { useEffect } from 'react';
import './ModalNoPassword.css';

const ModalNoPassword = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="blur-background" onClick={onClose} />
      <div className="modal-no-password" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <p className="modal-text">
            Мы отправили сообщение на указанный вами почтовый адрес.<br />
            Для восстановления пароля, пожалуйста, следуйте инструкции в письме.
          </p>
          <button 
            className="modal-ok-button" 
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalNoPassword;