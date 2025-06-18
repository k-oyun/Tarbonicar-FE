import {ChevronDownIcon} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";

export const AccordionItem = ({ value, label, children }) => (
    <Accordion.Item value={value}>
        <Accordion.Header>
            <Accordion.Trigger style={{ all: 'unset', display: 'flex', justifyContent: 'space-between', padding: '12px 20px', width: '100%', cursor: 'pointer' }}>
                <span>{label}</span>
                <ChevronDownIcon />
            </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content style={{ padding: '10px 20px' }}>
            {children}
        </Accordion.Content>
    </Accordion.Item>
);