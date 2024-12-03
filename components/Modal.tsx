import { Button, Modal } from "flowbite-react";
interface TermsOfServiceModalProps {
    title: string;
    openModal: boolean;
    status: boolean
    setOpenModal: (open: boolean) => void;
    children: React.ReactNode;
}

export function ComponentModalCreate({ title, openModal, setOpenModal, children, status }: TermsOfServiceModalProps) {
    return (
        <Modal dismissible show={openModal} size="4xl" onClose={() => setOpenModal(false)
        }>
            <Modal.Header>{title}</Modal.Header>
            < Modal.Body >
                {children}
            </Modal.Body>
            {
                status && (
                    <Modal.Footer className="flex justify-end">
                        <Button aria-label="Guardar" form="submit-form" type="submit" className="bg-verde-700">Guardar</Button>
                    </Modal.Footer>
                )
            }
        </Modal>
    );
}
