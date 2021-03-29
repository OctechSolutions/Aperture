import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
from datetime import datetime, timedelta
import dateutil.relativedelta

cred = credentials.Certificate("./zeta-range-302607-firebase-adminsdk-8idhm-2a42541c3c.json")
firebase_admin.initialize_app(cred, {
  'projectId': "zeta-range-302607",
})

db = firestore.client()
# For channels
doc =db.collection(u'globalLeaderBoards').document(u'channelLeaderBoard').get()
channels = doc.to_dict()[u"channels"]
now = datetime.now()
timeOneMonthBefore = now + dateutil.relativedelta.relativedelta(months=-1)
badge = "Fastest Growing Channel of " + timeOneMonthBefore.strftime('%B') + " " +str(timeOneMonthBefore.year)
if len(channels) >0:
    topChannel = channels[0]
    db.collection(u"channels").document(topChannel[u"id"]).update({
        u"badges" : badge + topChannel[u"badges"]
    })
docs = db.collection(u"channels").stream()
for doc in docs:
    channelData = doc.to_dict()
    channelId   = doc.id
    db.collection(u"channels").document(channelId).update({
        u"lastMonthFollowers" : len(channelData[u"followers"])
    })
