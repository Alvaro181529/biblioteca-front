import { Respuesta } from '@/lib/generateIA';
import React, { useState } from 'react';

// Componente Chatbot
const Chatbot: React.FC = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');


    const toggleChat = () => {
        setIsOpen(!isOpen);
    };


    const handleSendMessage = async () => {
        if (inputMessage.trim()) {
            setMessages((prevMessages) => [...prevMessages, `Tú: ${inputMessage}`]);


            setInputMessage('');
            const respuestaBot = await Respuesta(inputMessage);

            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    `Aria: ${respuestaBot}`,
                ]);
            }, 1000);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };



    return (
        <div>
            {/* Círculo para abrir el chat */}
            <div
                onClick={toggleChat}
                className="fixed bottom-5 right-5 z-50 flex size-16 cursor-pointer items-center justify-center rounded-full bg-verde-500 shadow-lg sm:size-12"
            >
                <i className="text-2xl text-white">💬</i>
            </div>


            {/* Ventana del chatbot */}
            {isOpen && (
                <div className="fixed bottom-24 right-5 z-40 flex h-96 w-80 flex-col rounded-lg bg-gray-50  p-4 shadow-2xl shadow-black ">
                    {/* Área del chat */}
                    <div className="mb-4 grow overflow-y-auto px-2">
                        {messages.map((message, index) => (
                            <div key={index} className="mb-2">
                                <span className={message.startsWith('Tú') ? 'text-verde-600' : 'text-gray-700'}>
                                    {message}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Entrada de texto y botón de enviar */}
                    <div className="flex flex-col">
                        <input
                            type="text"
                            id="chat-input"
                            placeholder="Escribe un mensaje..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="mb-2 rounded-md border border-gray-300 p-2"
                        />
                        <button
                            id="send-btn"
                            onClick={handleSendMessage}

                            className="rounded-md bg-verde-500 px-4 py-2 text-white hover:bg-verde-600"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default Chatbot;
