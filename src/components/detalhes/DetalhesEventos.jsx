import React from 'react';
import { EventoMedico } from "@/entities/EventoMedico";
import { Card, CardContent } from "@/components/ui/card";
import EventList from '../calendar/EventList';

export default function DetalhesEventos({ eventos, petId, onUpdate }) {
  const handleDeleteEvent = async (eventId) => {
    try {
      await EventoMedico.delete(eventId);
      onUpdate();
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
    }
  };

  return (
    <Card className="mt-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-0">
        <EventList 
          eventos={eventos}
          selectedDate={new Date()}
          pets={[{id: petId, nome: ''}]}
          onEditEvent={() => {}}
          onDeleteEvent={handleDeleteEvent}
          isLoading={false}
        />
      </CardContent>
    </Card>
  );
}