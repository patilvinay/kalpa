 // This code is generated using kalpa scafolding tool
 const Sequelize = require('sequelize');
<% entity=entity; const items = Object.keys(entity.properties); %>
   const <%=entity.Name%>Schema = {
       <%for (let i=0;i<items.length;i++) {%>
        <%=items[i]%>: Sequelize.<%=entity.properties[items[i]].type%> <%if (i < items.length-1) {%>, <% } %> <% } %>
}
  module.exports = <%=entity.Name%>Model