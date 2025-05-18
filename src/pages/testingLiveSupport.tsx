import React from 'react';
import Script from 'next/script';

function TestingLiveSupport() {
  return (
    <div>
      <Script id={'live-support'}>
        {`var LHC_API = LHC_API||{};
LHC_API.args = {mode:'widget',lhc_base_url:'//livehelperchat.runnel.ai/index.php/',wheight:450,wwidth:350,pheight:520,pwidth:500,domain:'30mins.com',leaveamessage:true,department:["30minsbilling","30minsmyaccount","30minsotherqueries","30minssales","30minssignupissues","30minsticketstatus"],theme:"5",check_messages:false};
(function() {
var po = document.createElement('script'); po.type = 'text/javascript'; po.setAttribute('crossorigin','anonymous'); po.async = true;
var date = new Date();po.src = '//livehelperchat.runnel.ai/design/defaulttheme/js/widgetv2/index.js?'+(""+date.getFullYear() + date.getMonth() + date.getDate());
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})()`}
      </Script>
    </div>
  );
}

export default TestingLiveSupport;
