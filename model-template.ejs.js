  // This code is generated using kalpa scafolding tool
const Sequelize = require('sequelize');

const <%=entity.name%>Schema = {
    <% for(var i = 0; i < entity.properties.length-1; ++i) {%>
         <%=entity.properties[i].name%>: <%=entity.properties[i].type%>, <% } %>
         <%=entity.properties[entity.properties.length-1].name%>: <%=entity.properties[entity.properties.length-1].type%>
        
}
const <%=entity.name%>Model = db.define(<%=entity.name%>, BusinessSchema)

module.exports = <%=entity.name%>Model