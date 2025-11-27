package in.horizonos.pulseserver.dao.interaction;

import in.horizonos.pulseserver.dao.interaction.models.InteractionDetailRow;
import in.horizonos.pulseserver.service.interaction.models.Event;
import in.horizonos.pulseserver.service.interaction.models.InteractionDetails;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public abstract class DaoInteractionMapper {
  public static DaoInteractionMapper INSTANCE = Mappers.getMapper(DaoInteractionMapper.class);

  public abstract InteractionDetailRow toInteractionDetailRow(InteractionDetails interactionDetails);

  public abstract Event copy(Event event);

  public abstract Event.Prop copy(Event.Prop prop);
}
