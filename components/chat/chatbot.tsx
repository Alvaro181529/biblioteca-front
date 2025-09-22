

// export default Chatbot;
import { Respuesta } from '@/lib/generateIA';
import React, { useState, useEffect, useRef } from 'react';

// Tipo de mensaje
type ChatMessage = {
    from: 'user' | 'bot';
    content: string;
    isHtml?: boolean;
};

// Componente Chatbot
const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => {
        const wasClosed = !isOpen;
        setIsOpen(!isOpen);
        if (wasClosed && messages.length === 0) {
            setMessages([
                {
                    from: 'bot',
                    content: "¡Hola! Soy Aria 😊 Estoy aquí para ayudarte con información sobre libros, música o cualquier búsqueda relacionada. ¿En qué puedo ayudarte hoy?"
                },
            ]);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputMessage.trim()) {
            // Añadir mensaje del usuario
            setMessages((prev) => [...prev, { from: 'user', content: inputMessage }]);

            const userMessage = inputMessage;
            setInputMessage('');

            // Obtener respuesta de Aria
            const respuestaBot = await Respuesta(userMessage);

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        from: 'bot',
                        content: respuestaBot || '',
                        isHtml: (respuestaBot || '').includes('<'),
                    },
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
            {/* Botón flotante para abrir/cerrar el chat */}
            <div
                onClick={toggleChat}
                className="fixed bottom-5 right-5 z-50 flex size-16 cursor-pointer items-center justify-center rounded-full bg-verde-500 shadow-lg sm:size-12"
            >
                <i className="text-2xl text-white">💬</i>
            </div>

            {/* Ventana del chatbot */}
            {isOpen && (
                <div className="fixed bottom-24 right-5 z-40 flex h-96 w-80 flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-2xl md:h-[500px] md:w-96">
                    {/* Área de mensajes */}
                    <div className="mb-4 grow overflow-y-auto px-2">
                        {messages.map((msg, index) => (
                            <div key={index} className="mb-3">
                                {msg.from === 'user' ? (
                                    <div className="text-verde-600">
                                        <strong>Tú:</strong> {msg.content}
                                    </div>
                                ) : msg.isHtml ? (
                                    <div
                                        className="text-gray-700"
                                        dangerouslySetInnerHTML={{
                                            __html: `<strong>Aria:</strong><br>${msg.content}`,
                                        }}
                                    />
                                ) : (
                                    <div className="text-gray-700">
                                        <strong>Aria:</strong> {msg.content}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Campo de entrada */}
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="mb-2 rounded-md border border-gray-300 p-2 text-sm"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="rounded-md bg-verde-500 px-4 py-2 text-sm text-white hover:bg-verde-600"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
